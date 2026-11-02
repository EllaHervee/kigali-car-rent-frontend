# Run Kigali Car Rent with its backend

The site now uses a small Node.js backend and a private JSON file for customer accounts and authentication activity. It does not need a separate database service. Run it on a Node.js host; static-only hosting such as GitHub Pages cannot run the backend.

## Run locally

Install Node.js 20 or newer. From this project folder, set a private admin password and start the server in PowerShell:

```powershell
$env:ADMIN_PASSWORD = "replace-this-with-a-unique-secret-of-at-least-12-characters"
npm start
```

Open `http://localhost:3000`. Select **Owner admin** in the footer and enter the configured `ADMIN_PASSWORD`. The admin password is not saved in the project.

## Deploy

Choose a host that supports a persistent Node.js process and writable persistent storage. Configure `ADMIN_PASSWORD` as a private environment variable in the host's settings, then run `npm start`. Use HTTPS in production; secure session cookies are enabled when `NODE_ENV=production`.

The server creates `data/store.json` automatically. Keep the `data` directory on persistent storage, restrict access to it, and back it up securely. It is excluded from Git. Do not commit or publish this file.

## What is stored

- Customer names, phone numbers, password salts and scrypt password hashes.
- Registration, successful/failed login, and logout events.
- Admin login/logout events.

Customer passwords must be 8–128 characters and contain at least one uppercase letter, one lowercase letter, and one number. Sign-up also asks the customer to confirm the password. Passwords are never stored in plain text and are not included in dashboard exports or activity logs. The admin dashboard is available from the **Owner admin** link in the page footer. Its Customers and Activity views and the download button use server records.

Bookings, payments, chats and notifications still use each visitor's browser storage; they are not yet centralized. Accounts created before this backend was added also remain in that browser and must register again to create a server account.

## Verify

Run the backend tests with:

```powershell
npm test
```
