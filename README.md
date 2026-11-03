
# Kigali Car Rent

The site and backend are maintained as separate projects:

- Frontend: this repository's [`frontend`](./frontend) directory.
- Backend: [EllaHervee/kigali-car-rent-backend](https://github.com/EllaHervee/kigali-car-rent-backend).

## Run the frontend locally

```powershell
cd frontend
npm install
npm run dev
```

Set `BACKEND_URL` to the backend's URL when it is not running on
`http://localhost:3001`.

## Run frontend checks

```powershell
cd frontend
npm run lint
npm run build
```

See [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) to deploy on Render, or
[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) to deploy on Vercel.
