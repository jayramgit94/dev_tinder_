# DevTinder

A Tinder-style networking platform for developers — swipe, match, chat, and collaborate.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit, Socket.io Client
- **Backend:** Express 5, MongoDB, Socket.io, JWT cookies

## Local setup

### Backend

```bash
cd tinder_backend
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```

API runs at `http://localhost:3000`

### Frontend

```bash
cd devTinder-web
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Seed data (optional)

```bash
cd tinder_backend
npm run seed
```

### Demo login

- Email: `demo@example.com`
- Password: `DemoUser123!`

## Features

- Landing page with marketing sections
- Auth (signup, login, logout)
- Onboarding wizard
- Swipe feed with filters (city, gender, skills)
- Match system (interested → accept)
- Real-time chat (WebSockets)
- Notification bell (matches, messages, requests)
- Profile edit
- Profile stats dashboard (requests, matches, unread messages)
- 21 seeded demo users with full relationship graph

## Deploy

Deploy order: **MongoDB Atlas → Backend (Render) → Frontend (Vercel) → connect URLs**.

### Phase A — MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → **Create** → free **M0** cluster
2. **Database Access** → Add user (password auth) → save username/password
3. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) — required for Render’s dynamic IPs
4. **Database** → **Connect** → **Drivers** → copy connection string
5. Replace `<password>` and set database name to `devtinder`:

   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/devtinder?retryWrites=true&w=majority`

6. Seed once (from your machine with Atlas URI in `.env`):

   ```powershell
   cd tinder_backend; npm run seed
   ```

### Phase B — Backend on Render

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** (or **Web Service**)
2. Connect repo `feature/your-change` branch
3. **Root Directory:** `tinder_backend`
4. **Build Command:** `npm install` · **Start Command:** `npm start`
5. Or apply `tinder_backend/render.yaml` from repo root (sets `rootDir: tinder_backend`, health check `/health`)

| Variable | Example / format |
|----------|-------------------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/devtinder?retryWrites=true&w=majority` |
| `JWT_SECRET` | long random string (32+ chars) |
| `FRONTEND_URL` | `https://your-app.vercel.app` (no trailing slash) |
| `NODE_ENV` | `production` |

6. After deploy, note backend URL: `https://devtinder-api.onrender.com`

### Phase C — Frontend on Vercel

1. [vercel.com/new](https://vercel.com/new) → import GitHub repo
2. **Root Directory:** `devTinder-web`
3. **Framework Preset:** Vite · **Build:** `npm run build` · **Output:** `dist`
4. Environment variables (Production + Preview):

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://devtinder-api.onrender.com/` |
| `VITE_SOCKET_URL` | `https://devtinder-api.onrender.com` |

5. Deploy — `vercel.json` rewrites all routes to `index.html` for SPA routing

CLI (optional, logged-in user required):

```powershell
cd devTinder-web; npx vercel --prod
```

### Phase D — Connect & verify

1. Render → set `FRONTEND_URL` to your live Vercel URL → **Manual Deploy**
2. Test backend: `https://<render-url>/health` → `{ "success": true, ... }`
3. Test login on Vercel with `demo@example.com` / `DemoUser123!` (after seeding)
4. Confirm real-time chat (WebSockets) works in inbox

### Post-deploy checklist

- [ ] `FRONTEND_URL` on Render matches Vercel URL exactly (scheme + host, no trailing slash)
- [ ] `VITE_*` vars set before Vercel build (redeploy after changing them)
- [ ] Atlas network access allows Render (`0.0.0.0/0` or Render static egress if configured)
- [ ] `JWT_SECRET` is not the `.env.example` placeholder
- [ ] `NODE_ENV=production` on Render (enables `secure` + `SameSite=None` cookies for cross-origin auth)

## Project structure

```
deploy_clean/
├── devTinder-web/     # React frontend
└── tinder_backend/    # Express API + Socket.io
```

## License

MIT
