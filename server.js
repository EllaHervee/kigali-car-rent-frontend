const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { promisify } = require("node:util");

const scrypt = promisify(crypto.scrypt);
const root = __dirname;
const dataDir = process.env.KCR_DATA_DIR || path.join(root, "data");
const storePath = path.join(dataDir, "store.json");
const port = Number(process.env.PORT || 3000);
const sessionLifetime = 7 * 24 * 60 * 60 * 1000;
const sessions = new Map();
const loginAttempts = new Map();
const adminPassword =
  process.env.ADMIN_PASSWORD ||
  (process.env.NODE_ENV === "production" ? "" : "admin-kigali-2026");
let store;
let writeQueue = Promise.resolve();
const providerTokens = new Map();

if (!adminPassword || adminPassword.length < 12) {
  console.error("Set ADMIN_PASSWORD to a secret of at least 12 characters.");
  process.exit(1);
}
if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "test") {
  console.log("Notice: using default development ADMIN_PASSWORD: admin-kigali-2026");
}

function json(res, status, value, headers) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end(JSON.stringify(value));
}

function error(res, status, message) {
  json(res, status, { error: message });
}

function cookieOptions(maxAge) {
  return [
    "kcr_session=" + (maxAge ? maxAge.token : ""),
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=" + (maxAge ? Math.floor(sessionLifetime / 1000) : 0),
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function getSession(req) {
  const raw = req.headers.cookie || "";
  const token = raw
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("kcr_session="))
    ?.slice("kcr_session=".length);
  const session = token && sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { ...session, token };
}

function createSession(res, role, phone) {
  const token = crypto.randomBytes(32).toString("base64url");
  sessions.set(token, {
    role,
    phone: phone || null,
    expiresAt: Date.now() + sessionLifetime,
  });
  res.setHeader("Set-Cookie", cookieOptions({ token }));
}

function normalizePhone(value) {
  return String(value || "")
    .replace(/[\s+-]/g, "")
    .replace(/^250/, "0");
}

function publicUser(phone, user) {
  return { name: user.name, phone, joinedAt: user.createdAt };
}

function logEvent(action, phone) {
  store.authEvents.push({
    action,
    phone: phone ? String(phone).slice(0, 20) : null,
    ts: Date.now(),
  });
  if (store.authEvents.length > 5000) {
    store.authEvents = store.authEvents.slice(-5000);
  }
  return saveStore();
}

function saveStore() {
  writeQueue = writeQueue.then(async () => {
    const temporaryPath = storePath + ".tmp";
    await fs.writeFile(temporaryPath, JSON.stringify(store, null, 2), {
      mode: 0o600,
    });
    await fs.rename(temporaryPath, storePath);
  });
  return writeQueue;
}

async function readJson(req) {
  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    throw Object.assign(new Error("Send a JSON request body."), { status: 415 });
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 8192) {
      throw Object.assign(new Error("Request body is too large."), {
        status: 413,
      });
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Invalid JSON request body."), {
      status: 400,
    });
  }
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function allowAttempt(req, route) {
  const key = route + ":" + (req.socket.remoteAddress || "unknown");
  const now = Date.now();
  const attempt = loginAttempts.get(key);
  if (!attempt || now - attempt.startedAt > 15 * 60 * 1000) {
    loginAttempts.set(key, { startedAt: now, count: 1 });
    return true;
  }
  attempt.count += 1;
  return attempt.count <= 10;
}

function resetAttempts(req, route) {
  loginAttempts.delete(
    route + ":" + (req.socket.remoteAddress || "unknown"),
  );
}

async function passwordHash(password, salt) {
  return scrypt(password, salt, 64);
}

function secureEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function paymentPublic(payment) {
  return {
    id: payment.id,
    provider: payment.provider,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    createdAt: payment.createdAt,
    confirmedAt: payment.confirmedAt || null,
  };
}

function adminPayment(payment) {
  return {
    ...paymentPublic(payment),
    name: payment.name,
    phone: payment.phone,
  };
}

function paymentProviderConfig(provider) {
  if (provider === "mtn") {
    const config = {
      baseUrl: "https://sandbox.momodeveloper.mtn.com",
      subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
      apiUser: process.env.MTN_MOMO_API_USER,
      apiKey: process.env.MTN_MOMO_API_KEY,
      targetEnvironment: "sandbox",
    };
    if (!config.subscriptionKey || !config.apiUser || !config.apiKey) {
      throw Object.assign(new Error("MTN sandbox payment is not configured on the server."), {
        status: 503,
      });
    }
    return config;
  }
  if (provider === "airtel") {
    const config = {
      baseUrl: "https://openapiuat.airtel.africa",
      clientId: process.env.AIRTEL_MONEY_CLIENT_ID,
      clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
    };
    if (!config.clientId || !config.clientSecret) {
      throw Object.assign(new Error("Airtel sandbox payment is not configured on the server."), {
        status: 503,
      });
    }
    return config;
  }
  throw Object.assign(new Error("Choose MTN or Airtel Mobile Money."), {
    status: 400,
  });
}

async function providerJson(url, options) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(15000),
  });
  let payload;
  try {
    payload = response.status === 204 ? {} : await response.json();
  } catch {
    payload = {};
  }
  if (!response.ok) {
    const e = new Error("The mobile-money provider rejected the request.");
    e.providerStatus = response.status;
    throw e;
  }
  return payload;
}

async function mtnToken(config) {
  const cached = providerTokens.get("mtn");
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const auth = Buffer.from(config.apiUser + ":" + config.apiKey).toString(
    "base64",
  );
  const payload = await providerJson(
    config.baseUrl + "/collection/token/",
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + auth,
        "Ocp-Apim-Subscription-Key": config.subscriptionKey,
      },
    },
  );
  if (!payload.access_token) throw new Error("MTN did not return an access token.");
  providerTokens.set("mtn", {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(30, Number(payload.expires_in || 3600) - 60) * 1000,
  });
  return payload.access_token;
}

async function airtelToken(config) {
  const cached = providerTokens.get("airtel");
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const payload = await providerJson(
    config.baseUrl + "/auth/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "client_credentials",
      }),
    },
  );
  if (!payload.access_token) {
    throw new Error("Airtel did not return an access token.");
  }
  providerTokens.set("airtel", {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(30, Number(payload.expires_in || 3600) - 60) * 1000,
  });
  return payload.access_token;
}

async function requestProviderPayment(payment) {
  const config = paymentProviderConfig(payment.provider);
  if (payment.provider === "mtn") {
    const token = await mtnToken(config);
    await providerJson(config.baseUrl + "/collection/v1_0/requesttopay", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": config.subscriptionKey,
        "X-Reference-Id": payment.id,
        "X-Target-Environment": config.targetEnvironment,
      },
      body: JSON.stringify({
        amount: String(payment.amount),
        currency: payment.currency,
        externalId: payment.id,
        payer: {
          partyIdType: "MSISDN",
          partyId: "250" + payment.phone.slice(1),
        },
        payerMessage: "Kigali Car Rent payment",
        payeeNote: "Kigali Car Rent",
      }),
    });
    return;
  }
  const token = await airtelToken(config);
  await providerJson(config.baseUrl + "/merchant/v1/payments/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Accept: "*/*",
      "X-Country": "RW",
      "X-Currency": payment.currency,
    },
    body: JSON.stringify({
      reference: "Kigali Car Rent " + payment.id,
      subscriber: {
        country: "RW",
        currency: payment.currency,
        msisdn: payment.phone.slice(1),
      },
      transaction: {
        amount: String(payment.amount),
        country: "RW",
        currency: payment.currency,
        id: payment.id,
      },
    }),
  });
}

function providerPaymentStatus(provider, payload) {
  const raw =
    provider === "mtn"
      ? payload.status
      : payload?.data?.transaction?.status ||
        payload?.status?.code ||
        payload?.status;
  const status = String(raw || "").toUpperCase();
  if (["SUCCESSFUL", "SUCCESS", "TS"].includes(status)) return "successful";
  if (["FAILED", "FAILURE", "TF", "EXPIRED", "CANCELLED"].includes(status)) {
    return "failed";
  }
  return "pending";
}

async function readProviderPaymentStatus(payment) {
  const config = paymentProviderConfig(payment.provider);
  if (payment.provider === "mtn") {
    const token = await mtnToken(config);
    const payload = await providerJson(
      config.baseUrl +
        "/collection/v1_0/requesttopay/" +
        encodeURIComponent(payment.id),
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Ocp-Apim-Subscription-Key": config.subscriptionKey,
          "X-Target-Environment": config.targetEnvironment,
        },
      },
    );
    return providerPaymentStatus("mtn", payload);
  }
  const token = await airtelToken(config);
  const payload = await providerJson(
    config.baseUrl +
      "/standard/v1/payments/" +
      encodeURIComponent(payment.id),
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "*/*",
        "X-Country": "RW",
        "X-Currency": payment.currency,
      },
    },
  );
  return providerPaymentStatus("airtel", payload);
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    return json(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/api/cars") {
    return json(res, 200, { cars: store.cars });
  }

  if (req.method === "GET" && url.pathname === "/api/bookings") {
    const session = getSession(req);
    if (!session) return json(res, 200, { bookings: [] });
    if (session.role === "admin") {
      return json(res, 200, { bookings: store.bookings });
    }
    const phone = session.phone;
    return json(res, 200, {
      bookings: store.bookings.filter((b) => b.phone === phone),
    });
  }

  if (req.method === "GET" && url.pathname === "/api/me") {
    const session = getSession(req);
    if (!session) return json(res, 200, { user: null });
    if (session.role === "admin") {
      return json(res, 200, { user: { role: "admin" } });
    }
    const user = store.users[session.phone];
    if (!user) return json(res, 200, { user: null });
    return json(res, 200, {
      user: { ...publicUser(session.phone, user), role: "customer" },
    });
  }

  if (req.method === "POST") {
    if (!sameOrigin(req)) return error(res, 403, "Request origin is not allowed.");
    let body;
    try {
      body = await readJson(req);
    } catch (e) {
      return error(res, e.status || 400, e.message);
    }

    if (url.pathname === "/api/register") {
      if (!allowAttempt(req, "register")) {
        return error(res, 429, "Too many attempts. Try again later.");
      }
      const name = String(body.name || "").trim();
      const phone = normalizePhone(body.phone);
      const password = String(body.password || "");
      if (!name || name.length > 100) {
        return error(res, 400, "Enter a name of at most 100 characters.");
      }
      if (!/^07\d{8}$/.test(phone)) {
        return error(res, 400, "Enter a valid Rwanda mobile number.");
      }
      if (password.length < 8 || password.length > 128) {
        return error(res, 400, "Password must be between 8 and 128 characters.");
      }
      if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return error(
          res,
          400,
          "Include at least one uppercase letter, one lowercase letter, and one number.",
        );
      }
      if (store.users[phone]) {
        await logEvent("Registration failed", phone);
        return error(res, 409, "This number already has an account. Please log in.");
      }
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = (await passwordHash(password, salt)).toString("hex");
      if (store.users[phone]) {
        await logEvent("Registration failed", phone);
        return error(res, 409, "This number already has an account. Please log in.");
      }
      store.users[phone] = { name, salt, hash, createdAt: Date.now() };
      await logEvent("Registration succeeded", phone);
      resetAttempts(req, "register");
      createSession(res, "customer", phone);
      return json(res, 201, {
        user: { ...publicUser(phone, store.users[phone]), role: "customer" },
      });
    }

    if (url.pathname === "/api/login") {
      if (!allowAttempt(req, "login")) {
        return error(res, 429, "Too many attempts. Try again later.");
      }
      const phone = normalizePhone(body.phone);
      const password = String(body.password || "");
      if (!/^07\d{8}$/.test(phone) || password.length > 1024) {
        await logEvent("Customer login failed", phone);
        return error(res, 401, "Wrong phone number or password.");
      }
      const user = store.users[phone];
      const calculatedHash = await passwordHash(
        password,
        user ? user.salt : "kcr-invalid-account-salt",
      );
      const valid =
        user &&
        secureEqual(calculatedHash, Buffer.from(user.hash, "hex"));
      if (!valid) {
        await logEvent("Customer login failed", phone);
        return error(res, 401, "Wrong phone number or password.");
      }
      resetAttempts(req, "login");
      await logEvent("Customer login succeeded", phone);
      createSession(res, "customer", phone);
      return json(res, 200, {
        user: { ...publicUser(phone, user), role: "customer" },
      });
    }

    if (url.pathname === "/api/admin/login") {
      if (!allowAttempt(req, "admin-login")) {
        return error(res, 429, "Too many attempts. Try again later.");
      }
      const suppliedHash = crypto
        .createHash("sha256")
        .update(String(body.password || ""))
        .digest();
      const configuredHash = crypto
        .createHash("sha256")
        .update(adminPassword)
        .digest();
      if (!crypto.timingSafeEqual(suppliedHash, configuredHash)) {
        await logEvent("Admin login failed");
        return error(res, 401, "Wrong admin password.");
      }
      resetAttempts(req, "admin-login");
      await logEvent("Admin login succeeded");
      createSession(res, "admin");
      return json(res, 200, { user: { role: "admin" } });
    }

    if (url.pathname === "/api/payments/request") {
      if (!allowAttempt(req, "payment-request")) {
        return error(res, 429, "Too many payment attempts. Try again later.");
      }
      const provider = String(body.provider || "").toLowerCase();
      const phone = normalizePhone(body.phone);
      const name = String(body.name || "").trim();
      const amount = Number(body.amount);
      if (!["mtn", "airtel"].includes(provider)) {
        return error(res, 400, "Choose MTN or Airtel Mobile Money.");
      }
      if (!/^07\d{8}$/.test(phone)) {
        return error(res, 400, "Enter a valid Rwanda mobile number.");
      }
      if (!name || name.length > 100) {
        return error(res, 400, "Enter your name.");
      }
      if (!Number.isSafeInteger(amount) || amount < 1 || amount > 50000000) {
        return error(res, 400, "Enter a valid payment amount in RWF.");
      }
      let config;
      try {
        config = paymentProviderConfig(provider);
      } catch (e) {
        return error(res, e.status || 503, e.message);
      }
      const payment = {
        id: crypto.randomUUID(),
        provider,
        phone,
        name,
        amount,
        currency: "RWF",
        status: "initiating",
        createdAt: Date.now(),
        confirmedAt: null,
      };
      store.payments.push(payment);
      await saveStore();
      try {
        await requestProviderPayment(payment, config);
        payment.status = "pending";
        await saveStore();
        return json(res, 202, {
          payment: paymentPublic(payment),
          message: "Approve the payment request in your mobile-money prompt.",
        });
      } catch (e) {
        payment.status = "failed";
        await saveStore();
        console.error(
          "Mobile-money request failed for " +
            provider +
            " (HTTP " +
            (e.providerStatus || "network error") +
            ").",
        );
        return error(
          res,
          502,
          "The provider could not start this payment. Check the number and try again.",
        );
      }
    }

    if (url.pathname === "/api/bookings") {
      const car = String(body.car || "").slice(0, 100).trim();
      const name = String(body.name || "").slice(0, 100).trim();
      const phone = normalizePhone(body.phone);
      const d1 = String(body.d1 || "").slice(0, 20);
      const d2 = String(body.d2 || "").slice(0, 20);
      const days = Number(body.days) || 1;
      const driver = Boolean(body.driver);
      const total = Number(body.total) || 0;
      const paid = Number(body.paid) || 0;
      const loc = String(body.loc || "Kigali").slice(0, 100);
      const nid = String(body.nid || "").slice(0, 50);
      const status = String(body.status || "Booked").slice(0, 30);

      if (!car || !name || !phone) {
        return error(res, 400, "Please provide car, customer name, and phone number.");
      }

      const ref =
        body.ref && /^KCR-[A-Z0-9-]{3,24}$/i.test(body.ref)
          ? String(body.ref).toUpperCase()
          : "KCR-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            crypto.randomBytes(2).toString("hex").toUpperCase();

      const booking = {
        ref,
        car,
        name,
        phone,
        d1,
        d2,
        days,
        driver,
        total,
        paid,
        loc,
        nid,
        status,
        createdAt: Date.now(),
      };
      store.bookings.unshift(booking);
      await logEvent("New booking " + ref, phone);
      await saveStore();
      return json(res, 201, { booking });
    }

    if (url.pathname === "/api/admin/cars") {
      const session = getSession(req);
      if (!session || session.role !== "admin") {
        return error(res, 401, "Admin login is required.");
      }
      const id = Number(body.id) || Date.now();
      const name = String(body.name || body.n || "").slice(0, 100).trim();
      const cat = String(body.category || body.cat || "economy").toLowerCase();
      const price = Number(body.price || body.p || 0);
      const transmission = String(body.transmission || body.tr || "Automatic");
      const seats = Number(body.seats || body.s || 5);
      const fuel = String(body.fuel || body.f || "Petrol");
      const status = String(body.status || "Available");
      const img = String(body.img || "images/car-1.jpg");

      if (!name) return error(res, 400, "Provide a car name.");
      const carIndex = store.cars.findIndex((c) => c.id === id);
      const carData = {
        id,
        name,
        cat,
        price,
        transmission,
        seats,
        fuel,
        status,
        img,
      };
      if (carIndex > -1) {
        store.cars[carIndex] = { ...store.cars[carIndex], ...carData };
      } else {
        store.cars.push(carData);
      }
      await logEvent("Car fleet updated: " + name);
      await saveStore();
      return json(res, 200, { cars: store.cars, car: carData });
    }

    if (url.pathname === "/api/contact") {
      const name = String(body.name || "").slice(0, 100).trim();
      const phone = normalizePhone(body.phone);
      const message = String(body.message || "").slice(0, 2000).trim();
      if (!name || !message) {
        return error(res, 400, "Enter your name and message.");
      }
      const msg = {
        id: crypto.randomUUID(),
        name,
        phone,
        message,
        createdAt: Date.now(),
        status: "unread",
      };
      store.messages.unshift(msg);
      await logEvent("Inquiry received from " + name, phone);
      await saveStore();
      return json(res, 201, { ok: true, message: msg });
    }

    if (url.pathname === "/api/logout") {
      const session = getSession(req);
      if (session) {
        await logEvent(
          session.role === "admin" ? "Admin logout" : "Customer logout",
          session.phone,
        );
        sessions.delete(session.token);
      }
      res.setHeader("Set-Cookie", cookieOptions(null));
      return json(res, 200, { ok: true });
    }
  }

  const paymentMatch = url.pathname.match(/^\/api\/payments\/([0-9a-f-]{36})$/i);
  if (req.method === "GET" && paymentMatch) {
    const payment = store.payments.find(
      (item) => item.id === paymentMatch[1],
    );
    if (!payment) return error(res, 404, "Payment request not found.");
    if (payment.status === "pending") {
      try {
        const status = await readProviderPaymentStatus(payment);
        if (status !== payment.status) {
          payment.status = status;
          if (status === "successful") payment.confirmedAt = Date.now();
          await saveStore();
        }
      } catch (e) {
        console.error(
          "Mobile-money status check failed for " +
            payment.provider +
            " (HTTP " +
            (e.providerStatus || "network error") +
            ").",
        );
        return error(
          res,
          503,
          "Could not check the payment status. Retry shortly.",
        );
      }
    }
    return json(res, 200, { payment: paymentPublic(payment) });
  }

  const adminBookingMatch = url.pathname.match(
    /^\/api\/admin\/bookings\/([A-Za-z0-9_-]+)$/,
  );
  if (adminBookingMatch) {
    const session = getSession(req);
    if (!session || session.role !== "admin") {
      return error(res, 401, "Admin login is required.");
    }
    if (!sameOrigin(req)) {
      return error(res, 403, "Request origin is not allowed.");
    }
    const ref = adminBookingMatch[1].toUpperCase();
    const booking = store.bookings.find(
      (b) => String(b.ref).toUpperCase() === ref,
    );
    if (!booking) {
      return error(res, 404, "Booking not found.");
    }

    if (req.method === "PATCH") {
      let body;
      try {
        body = await readJson(req);
      } catch (e) {
        return error(res, e.status || 400, e.message);
      }
      if (body.status !== undefined) {
        booking.status = String(body.status).slice(0, 30);
      }
      if (body.paid !== undefined && Number.isSafeInteger(Number(body.paid))) {
        booking.paid = Number(body.paid);
      }
      await logEvent("Booking " + ref + " status: " + booking.status);
      await saveStore();
      return json(res, 200, { booking });
    }

    if (req.method === "DELETE") {
      store.bookings = store.bookings.filter(
        (b) => String(b.ref).toUpperCase() !== ref,
      );
      await logEvent("Booking " + ref + " deleted");
      await saveStore();
      return json(res, 200, { ok: true });
    }
  }

  if (req.method === "GET" && url.pathname === "/api/admin/data") {
    const session = getSession(req);
    if (!session || session.role !== "admin") {
      return error(res, 401, "Admin login is required.");
    }
    return json(res, 200, {
      users: Object.keys(store.users).map((phone) =>
        publicUser(phone, store.users[phone]),
      ),
      authEvents: store.authEvents,
      payments: store.payments.map(adminPayment),
      bookings: store.bookings,
      cars: store.cars,
      messages: store.messages,
    });
  }

  return error(res, 404, "API route not found.");
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function serveStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return error(res, 405, "Method not allowed.");
  }
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return error(res, 400, "Invalid URL path.");
  }
  if (pathname === "/" || pathname === "/admin" || pathname === "/admin/") pathname = "/index.html";
  if (!/^\/(?:index\.html|(?:css|js|images)\/[a-zA-Z0-9._-]+)$/.test(pathname)) {
    return error(res, 404, "File not found.");
  }
  const filePath = path.resolve(root, "." + pathname);
  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type":
        contentTypes[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch (e) {
    if (e.code === "ENOENT") return error(res, 404, "File not found.");
    throw e;
  }
}

async function start() {
  await fs.mkdir(dataDir, { recursive: true, mode: 0o700 });
  try {
    store = JSON.parse(await fs.readFile(storePath, "utf8"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    store = {
      users: {},
      authEvents: [],
      payments: [],
      bookings: [],
      cars: [],
      messages: [],
    };
  }
  if (!Array.isArray(store.payments)) store.payments = [];
  if (!Array.isArray(store.bookings)) store.bookings = [];
  if (!Array.isArray(store.cars)) store.cars = [];
  if (!Array.isArray(store.messages)) store.messages = [];
  if (
    !store ||
    !store.users ||
    typeof store.users !== "object" ||
    Array.isArray(store.users) ||
    !Array.isArray(store.authEvents)
  ) {
    throw new Error("The data store has an invalid format: " + storePath);
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
    const handler = url.pathname.startsWith("/api/")
      ? handleApi(req, res, url)
      : serveStatic(req, res, url);
    handler.catch((e) => {
      console.error(e);
      if (!res.headersSent) error(res, 500, "The server could not complete the request.");
      else res.destroy();
    });
  });
  server.listen(port, () => {
    console.log("Kigali Car Rent server listening on port " + server.address().port);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
