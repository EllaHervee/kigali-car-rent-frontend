# Deploy the Frontend to Vercel

The frontend is a Next.js app. The booking experience is served from
`frontend/public`, and `/api/*` requests are forwarded to the independently
deployed backend.

1. Import `EllaHervee/kigali-car-rent` into Vercel.
2. Set the project **Root Directory** to `frontend`.
3. Set `BACKEND_URL` to the public HTTPS URL of the backend service, without a
   trailing slash.
4. Deploy with the default Next.js build settings.

Deploy the backend separately from
[`EllaHervee/kigali-car-rent-backend`](https://github.com/EllaHervee/kigali-car-rent-backend).
Configure its `DATABASE_URL`, `ADMIN_PASSWORD`, and payment-provider credentials
as private environment variables. The backend creates its database table on the
first request.
