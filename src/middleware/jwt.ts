import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';

// Verify Supabase-issued JWTs. Requires SUPABASE_JWT_SECRET in environment.
export async function verifySupabaseJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const [, token] = authHeader.split(' ');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) {
    console.error('Missing SUPABASE_JWT_SECRET in environment');
    return res.status(500).json({ error: 'Server not configured for auth verification' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as Record<string, any>;
    // Attach raw payload
    (req as any).user = payload;

    // Optionally, get the full user record from Supabase to read metadata/roles
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        (req as any).user_record = data.user;
      }
    } catch (e) {
      // Non-fatal: continue with the JWT payload
      console.warn('Could not fetch user record from Supabase', e);
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
