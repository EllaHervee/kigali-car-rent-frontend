# Deploy the Frontend to Vercel

The frontend is a Next.js app. The booking experience is served from
`frontend/public`, and `/api/*` requests are forwarded to the independently
deployed backend.

1. Import `EllaHervee/kigali-car-rent` into Vercel.
2. Set the project **Root Directory** to `frontend`.
3. Deploy with the default Next.js build settings. The frontend can be deployed
   before the backend, but booking, login, payment, and other API features will
   be unavailable until the backend is deployed.
4. Production builds use the Kigali Car Rent Render backend by default. To use
   a different backend, set `BACKEND_URL` in Vercel to its public HTTPS URL,
   without a trailing slash, and redeploy.

Deploy the backend separately from
[`EllaHervee/kigali-car-rent-backend`](https://github.com/EllaHervee/kigali-car-rent-backend).
Configure its `DATABASE_URL`, `ADMIN_PASSWORD`, and payment-provider credentials
as private environment variables. The backend creates its database table on the
first request.
