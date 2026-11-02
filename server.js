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
const adminPassword = process.env.ADMIN_PASSWORD;
let store;
let writeQueue = Promise.resolve();

if (!adminPassword || adminPassword.length < 12) {
  console.error("Set ADMIN_PASSWORD to a secret of at least 12 characters.");
  process.exit(1);
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

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    return json(res, 200, { ok: true });
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
  if (pathname === "/") pathname = "/index.html";
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
    store = { users: {}, authEvents: [] };
  }
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
