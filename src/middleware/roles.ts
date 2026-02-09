import { Request, Response, NextFunction } from 'express';

// requireAdmin inspects the Supabase user record attached by verifySupabaseJWT
// and checks for a metadata flag `role: 'admin'` or `is_admin: true`.
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userRecord = (req as any).user_record as any | undefined;

  if (!userRecord) {
    return res.status(403).json({ error: 'No user record attached' });
  }

  // Supabase stores custom claims in user.user_metadata
  const metadata = userRecord.user_metadata || userRecord.user_metadata || {};

  const role = metadata.role || metadata?.is_admin ? (metadata.role || 'admin') : null;

  if (metadata.role === 'admin' || metadata.is_admin === true) {
    return next();
  }

  return res.status(403).json({ error: 'Admin role required' });
}

export default requireAdmin;
