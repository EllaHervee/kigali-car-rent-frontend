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
4. Configure `RESEND_API_KEY` and `AUTH_EMAIL_FROM` on the backend. Create a
   Resend API key and verify the sender domain/address in Resend before using
   it. These settings send account verification links and administrator login
   alerts to `ADMIN_EMAIL`. Phone sign-ups must also provide an email address.
   The frontend URL used in verification links is configured by `FRONTEND_URL`.

Customer account deletion is scheduled 30 days after the request and can be
cancelled from Settings before then. Expired account profiles are purged hourly
by the backend; booking and payment records are retained.

The frontend can deploy before the backend, but booking, login, payment, and
other API features will not work until `BACKEND_URL` points to a running
backend.
