# Kigali Car Rent — Backend & Admin Dashboard

The site features a full Node.js backend and a JSON datastore for bookings, vehicle fleet management, customer accounts, payment tracking, and audit logging. It requires Node.js and persistent storage.

## Run locally

Install Node.js 20 or newer. In development, a default admin password (`admin-kigali-2026`) is provided automatically, or you can configure your own secret:

```powershell
# Optional: Set a custom admin password (minimum 12 characters)
$env:ADMIN_PASSWORD = "replace-this-with-a-unique-secret-of-at-least-12-characters"

# Optional: Mobile Money sandbox credentials
$env:MTN_MOMO_SUBSCRIPTION_KEY = "your-MTN-sandbox-subscription-key"
$env:MTN_MOMO_API_USER = "your-MTN-sandbox-api-user"
$env:MTN_MOMO_API_KEY = "your-MTN-sandbox-api-key"
$env:AIRTEL_MONEY_CLIENT_ID = "your-Airtel-sandbox-client-id"
$env:AIRTEL_MONEY_CLIENT_SECRET = "your-Airtel-sandbox-client-secret"

npm start
```

Open `http://localhost:3000`.

### Accessing the Admin Dashboard

The Admin Dashboard can be accessed in several convenient ways:
1. **Header Navigation**: Click the **Admin** link in the top navigation bar.
2. **Direct URL**: Navigate to `http://localhost:3000/admin` (or `http://localhost:3000/#admin`).
3. **Header User Area**: When logged in as Admin, the header displays an **Admin Dashboard** button and a **Log out** button.
4. **Footer**: Click **Owner admin** in the website footer.

Enter the configured `ADMIN_PASSWORD` (or `admin-kigali-2026` by default in development) to log in.

### Admin Dashboard Features

- **Key Metrics Overview**: Real-time stats showing Total Bookings (active vs cancelled), Confirmed Revenue (in RWF), Balance Due, Fleet Status (available vs rented cars), and Registered Customers.
- **Bookings Management**:
  - View all customer bookings centralized on the server.
  - Search by customer name, phone number, car model, reference, or location.
  - Filter by booking status (`All`, `Booked`, `Picked up`, `Returned`, `Cancelled`).
  - Update booking status with live synchronization to server.
  - View full booking details (national ID/passport, pickup location, rental duration, deposit/paid balance).
  - Create manual Walk-in bookings directly from the dashboard.
  - Delete or cancel bookings.
- **Fleet & Vehicle Management**:
  - View full fleet of vehicles with photos, category, transmission, seats, fuel, and daily price.
  - One-click status change: `Available`, `Rented`, `Maintenance`.
  - Edit daily rental price for any vehicle.
  - Add new cars to the fleet.
- **Payments Management**:
  - Audit trail of mobile-money and offline transactions.
  - Filter by payment provider (`MTN`, `Airtel`, `Cash`) and status (`Successful`, `Pending`, `Failed`).
- **Customer Management**:
  - List of registered customers with Rwanda mobile numbers and registration dates.
  - Total bookings and total amount spent per customer.
  - Quick filter to inspect all bookings by a specific customer.
- **Inquiries & Live Chats**:
  - Real-time customer chat threads and contact form inquiries.
  - Inline reply tool for admin support.
- **Security Audit Logs**:
  - Complete log of registrations, login attempts, payments, and admin actions.
- **Data Export & Backup**:
  - Export Bookings, Fleet, Payments, and Customers as formatted CSV files.
  - Download complete database backup as JSON.

## Deploy

Choose a host that supports a persistent Node.js process and writable storage (e.g. Render, Railway, DigitalOcean, VPS). Configure `ADMIN_PASSWORD` as a private environment variable in the host's settings, then run `npm start`.

Production deployments automatically enable secure `SameSite=Strict` HTTP cookies over HTTPS when `NODE_ENV=production`.

## What is stored

- **Bookings**: Centralized rental records (dates, vehicle, customer, financials, status).
- **Fleet**: Vehicle status overrides, rates, and added cars.
- **Accounts**: Customer names, phone numbers, cryptographic password salts, and scrypt hashes. Passwords are never stored in plain text and are excluded from exports.
- **Payments**: Mobile-money payment request metadata and provider-confirmed statuses.
- **Activity**: Authentication and security event logs.

## Verify

Run the backend test suite with:

```powershell
npm test
```
