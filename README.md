# DevTinder

A Tinder-style networking platform for developers — swipe, match, chat, and collaborate.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit
- **Backend:** Express 5, MongoDB Atlas, JWT cookies (Vercel serverless)
- **Deploy:** Single Vercel project (frontend + API at `/api/*`)

## Local setup

### 1. MongoDB

Copy env and set your Atlas URI:

```powershell
cd tinder_backend
cp .env.example .env
# Edit .env — set MONGO_URI to your Atlas connection string
npm install
npm run test:mongo
```

Expected output: `SUCCESS: Connected to MongoDB`

### 2. Backend

```powershell
cd tinder_backend
npm run dev
```

API runs at `http://localhost:3000`

Health check: `http://localhost:3000/health` → includes `"mongo": "connected"`

### 3. Frontend

```powershell
cd devTinder-web
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Seed data (optional)

```powershell
cd tinder_backend
npm run seed
```

### Demo login

- Email: `demo@example.com`
- Password: `DemoUser123!`

## Deploy to Vercel (all-in-one)

### Step 1 — MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → free **M0** cluster
2. **Database Access** → create user + password
3. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. **Connect → Drivers** → copy URI:

   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/devtinder?retryWrites=true&w=majority`

5. Test locally: `cd tinder_backend; npm run test:mongo`
6. Seed once: `npm run seed`

### Step 2 — Vercel project

1. [vercel.com/new](https://vercel.com/new) → import **`jayramgit94/dev_tinder_`**
2. **Root Directory:** `.` (repo root — not `devTinder-web`)
3. Framework: **Other** (uses root `vercel.json`)

### Step 3 — Environment variables (Vercel dashboard)

| Variable | Value |
|----------|-------|
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | long random string (32+ chars) |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `/api/` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (your Vercel URL, no trailing slash) |

Set all for **Production** and **Preview**. Redeploy after adding env vars.

### Step 4 — Verify

1. `https://your-app.vercel.app/api/health` → `{ "success": true, "mongo": "connected" }`
2. Open app → login with demo credentials
3. Feed, profile, inbox work (chat refreshes every few seconds)

### CLI deploy (optional)

```powershell
cd "path/to/deploy_clean"
npx vercel --prod
```

## Project structure

```
dev_tinder_/
├── api/index.js           # Vercel serverless Express entry
├── vercel.json            # Build + routing config
├── devTinder-web/         # React frontend
└── tinder_backend/        # Express API + MongoDB models
```

## License

MIT
