# AVERY-SERVICE-TRACK-API

Node.js + Express + TypeScript scaffold for the AVERY Service Tracking API.

Quick start:

1. Copy `.env.example` to `.env` and fill values.
2. npm install
3. npm run dev

Auth:
- POST /auth/login { username, password } -> { token }
- Use `Authorization: Bearer <token>` for protected routes.

Notes:
- Replace the simple admin-login with Supabase user lookup in production.
- Store secrets in Vercel project environment variables when deploying.
