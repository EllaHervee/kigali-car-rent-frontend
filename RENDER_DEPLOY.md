# Deploy Kigali Car Rent to Render (render.com)

Render provides free Node.js hosting with HTTPS, custom domains, and automatic deployments from GitHub.

---

## Prerequisites: Push Your Latest Code to GitHub

Render builds your site directly from your GitHub repository (`https://github.com/EllaHervee/kigali-car-rent`).

Open PowerShell or terminal in your project directory and push your latest code:

```powershell
git add .
git commit -m "Configure Render deployment settings and blueprint"
git push origin main
```

---

## Method 1: Automatic 1-Click Deployment (Using `render.yaml` Blueprint) — Recommended

1. Log in to [dashboard.render.com](https://dashboard.render.com/) (create a free account if you haven't yet).
2. Click the **New +** button in the top right and select **Blueprint**.
3. Connect your GitHub account and select your repository: **`EllaHervee/kigali-car-rent`**.
4. Render will automatically detect the [`render.yaml`](render.yaml) file in the repo.
5. Click **Apply**.
6. Render will build and deploy your app. When finished, your live URL will be shown at the top (e.g. `https://kigali-car-rent.onrender.com`).

> **Admin Password on Render**:
> Render automatically generates a secure, random `ADMIN_PASSWORD`.
> To see it: Go to your service in the Render dashboard, click **Environment** in the left sidebar, and click the eye icon to reveal the `ADMIN_PASSWORD`. You can also edit it to any password of at least 12 characters that you prefer!

---

## Method 2: Manual Web Service Setup (Alternative)

If you prefer to configure the service manually on Render:

1. In the Render Dashboard, click **New +** ➔ **Web Service**.
2. Select **Build and deploy from a Git repository** and connect **`EllaHervee/kigali-car-rent`**.
3. Configure the service settings:
   - **Name**: `kigali-car-rent` (or your preferred name)
   - **Region**: Choose the closest region (e.g., `Frankfurt` or `Oregon`)
   - **Branch**: `main`
   - **Root Directory**: leave blank
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Expand **Environment Variables** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables secure HTTPS cookies |
   | `HOST` | `0.0.0.0` | Binds to all interfaces |
   | `ADMIN_PASSWORD` | `your-secret-password-min-12-chars` | Must be at least 12 characters |
   | `KCR_DATA_DIR` | `./data` | Directory for store.json |
5. Click **Deploy Web Service**.

---

## Accessing Your Deployed Website & Admin Dashboard

Once deployed:
1. Open your live URL (e.g. `https://kigali-car-rent.onrender.com`).
2. Click **Admin** in the header navigation or open `https://<your-service>.onrender.com/admin`.
3. Enter your configured `ADMIN_PASSWORD`.
4. You now have full access to:
   - Live fleet management and status toggling
   - Centralized customer bookings
   - Mobile Money & cash payment tracking
   - Customer accounts and activity audit logs
   - CSV & JSON data exports

---

## Note on Free Tier Data Persistence

- On Render's Free tier, the filesystem is ephemeral (resets on restart or new deployment).
- To keep bookings and customer data permanently saved across server restarts, Render offers **Persistent Disks** on paid plans (attach disk to `./data`).
- You can also export full backups at any time via the **Download JSON** and **Export CSV** buttons in the Admin Dashboard!
