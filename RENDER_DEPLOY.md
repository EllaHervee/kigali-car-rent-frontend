# Deploy to Render

The frontend is a Next.js app, and its `/api/*` requests are forwarded to the
separately deployed backend.

1. In Render, create a **Blueprint** and connect
   [`EllaHervee/kigali-car-rent`](https://github.com/EllaHervee/kigali-car-rent).
   Render will use the root `render.yaml` to configure the frontend service.
2. Set `BACKEND_URL` to the public HTTPS URL of the backend service, without a
   trailing slash. If you do not have a backend URL yet, deploy the separate
   [backend repository](https://github.com/EllaHervee/kigali-car-rent-backend)
   as a Render web service, then set this variable in the frontend service's
   environment settings and redeploy.
3. Configure the backend's `DATABASE_URL`, `ADMIN_PASSWORD`, and any payment
   provider credentials as private environment variables on its Render service.
   To enable Google sign-up, create a Google OAuth 2.0 Web application client,
   add the frontend's public URL as an authorized JavaScript origin, and set
   its client ID as the backend's `GOOGLE_CLIENT_ID`.

The frontend can deploy before the backend, but booking, login, payment, and
other API features will not work until `BACKEND_URL` points to a running
backend.
