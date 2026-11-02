const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { once } = require("node:events");
const test = require("node:test");

test("server persists accounts and protects admin records", async (t) => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "kcr-backend-"));
  const server = spawn(process.execPath, [path.join(__dirname, "server.js")], {
    env: {
      ...process.env,
      ADMIN_PASSWORD: "test-admin-password-2026",
      KCR_DATA_DIR: dataDir,
      PORT: "0",
      NODE_ENV: "test",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });
  t.after(async () => {
    server.kill();
    await once(server, "exit").catch(() => {});
    await fs.rm(dataDir, { recursive: true, force: true });
  });

  const startedAt = Date.now();
  while (!output.includes("listening on port")) {
    if (Date.now() - startedAt > 5000) {
      throw new Error("Backend did not start: " + output);
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  const port = Number(output.match(/port (\d+)/)[1]);
  const base = "http://127.0.0.1:" + port;
  const request = (route, options) =>
    fetch(base + route, {
      ...options,
      headers: {
        ...(options && options.headers),
        ...(options && options.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  const body = (value) => JSON.stringify(value);
  const cookieFrom = (response) =>
    response.headers.get("set-cookie").split(";")[0];

  const unauthenticated = await request("/api/admin/data");
  assert.equal(unauthenticated.status, 401);

  const weakPassword = await request("/api/register", {
    method: "POST",
    body: body({
      name: "Test Customer",
      phone: "0783553434",
      password: "password",
    }),
  });
  assert.equal(weakPassword.status, 400);

  const registered = await request("/api/register", {
    method: "POST",
    body: body({
      name: "Test Customer",
      phone: "0783553434",
      password: "Customer123",
    }),
  });
  assert.equal(registered.status, 201);
  const customerCookie = cookieFrom(registered);
  assert.equal(
    (
      await (
        await request("/api/me", { headers: { Cookie: customerCookie } })
      ).json()
    ).user.role,
    "customer",
  );
  await request("/api/logout", {
    method: "POST",
    headers: { Cookie: customerCookie },
    body: "{}",
  });

  const failedLogin = await request("/api/login", {
    method: "POST",
    body: body({ phone: "0783553434", password: "WrongCustomer123" }),
  });
  assert.equal(failedLogin.status, 401);

  const loggedIn = await request("/api/login", {
    method: "POST",
    body: body({ phone: "0783553434", password: "Customer123" }),
  });
  assert.equal(loggedIn.status, 200);

  const adminLogin = await request("/api/admin/login", {
    method: "POST",
    body: body({ password: "test-admin-password-2026" }),
  });
  assert.equal(adminLogin.status, 200);
  const dashboard = await request("/api/admin/data", {
    headers: { Cookie: cookieFrom(adminLogin) },
  });
  assert.equal(dashboard.status, 200);
  const records = await dashboard.json();
  assert.equal(records.users[0].phone, "0783553434");
  assert.ok(records.authEvents.some((event) => event.action === "Registration succeeded"));
  assert.ok(records.authEvents.some((event) => event.action === "Customer login failed"));
  const stored = await fs.readFile(path.join(dataDir, "store.json"), "utf8");
  assert.equal(stored.includes("Customer123"), false);
  assert.equal((await request("/data/store.json")).status, 404);
  assert.equal(JSON.stringify(records).includes("salt"), false);
  assert.equal(JSON.stringify(records).includes("hash"), false);

  const staticPage = await request("/");
  assert.equal(staticPage.status, 200);
  assert.match(await staticPage.text(), /Kigali Car Rent/);
});
