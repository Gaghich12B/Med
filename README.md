# Healthcare Pro Network

A professional networking and continuing education platform for healthcare professionals (nurses, NPs, PAs, physicians).

## 🚀 Deploying to Vercel

Before the app can accept sign-ins you must:

### 1. Provision a PostgreSQL database

Use any PostgreSQL provider that works with Vercel:

- **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** (recommended — 1-click from the Vercel dashboard)
- [Neon](https://neon.tech) (free tier available)
- [Supabase](https://supabase.com) (free tier available)

### 2. Set environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string from your provider (e.g. `postgresql://user:pass@host/db?sslmode=require`) |
| `NEXTAUTH_URL` | Your deployed URL — e.g. `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | A long random string — generate with `openssl rand -base64 32` |

> ⚠️ **Missing any of these three variables is the most common reason sign-in fails.**

### 3. Redeploy

After setting the environment variables, trigger a new deployment (push a commit or click "Redeploy" in the Vercel dashboard).

On each deployment the build step automatically runs:
```
prisma generate && prisma db push && next build
```
This creates/updates all database tables so sign-up and sign-in work immediately.

### 4. (Optional) Seed demo users

To create demo accounts locally or in a fresh database:
```bash
npx prisma db seed
```

Demo accounts (password `password123`):
- `nurse@example.com` — Sarah Johnson (Nurse)
- `np@example.com` — Michael Chen (Nurse Practitioner)
- `pa@example.com` — Emily Rodriguez (Physician Assistant)

---

## 🛠️ Local development

```bash
# 1. Copy env template
cp .env.example .env
# Edit .env — set DATABASE_URL to a local PostgreSQL instance

# 2. Install dependencies
npm install

# 3. Push the schema to your local DB and generate the Prisma client
npx prisma db push

# 4. (Optional) Seed demo data
npx prisma db seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + shadcn/ui components
- **Prisma ORM** + **PostgreSQL**
- **NextAuth.js v4** (JWT sessions, Credentials provider)

