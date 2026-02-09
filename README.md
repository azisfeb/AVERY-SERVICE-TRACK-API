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
Authentication (Supabase)
 - This scaffold now supports Supabase Auth. Set the following env vars in your `.env` or Vercel project settings:
	 - SUPABASE_URL
	 - SUPABASE_KEY (service role or admin key for server operations)
	 - SUPABASE_JWT_SECRET (Supabase project's JWT secret) — required to verify incoming access tokens
 - Login endpoint: POST /auth/login { email, password } -> { access_token, refresh_token, user }
 - Protected routes expect `Authorization: Bearer <access_token>` where the token is the Supabase access_token.

Notes:
 - For admin/role checks, store a `role` or `is_admin` flag in the user's metadata in Supabase and check `(req as any).user_record` (attached by the middleware) or fetch the user record from Supabase as needed.
 - Use Vercel environment variables (not checked in) to store SUPABASE_KEY and SUPABASE_JWT_SECRET.

Role-based middleware
 - The backend includes a `requireAdmin` middleware at `src/middleware/roles.ts` which checks `user_record.user_metadata.role === 'admin'` or `user_record.user_metadata.is_admin === true`.

Database schema
 - An example SQL migration is added at `sql/migrations/001_schema.sql` to create tables for `profiles`, `units`, `hour_logs`, `services`, and `notifications`.

Token refresh
 - The backend exposes POST `/auth/refresh` which accepts `{ refresh_token }` and exchanges it with Supabase Auth REST endpoint to obtain a new access token. This requires `SUPABASE_URL` and `SUPABASE_KEY` server-side env vars.
