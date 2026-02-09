import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Login with Supabase (email + password). Returns Supabase access token on success.
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Return the access token and user record. Client should store access_token and send as Bearer for protected routes.
    return res.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: data.user,
    });
  } catch (err: any) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Optional: endpoint to get current user (requires Bearer token)
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: error.message });
    return res.json({ user: data.user });
  } catch (e: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
