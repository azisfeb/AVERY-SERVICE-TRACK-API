import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

// Exchange refresh token for new access token using Supabase Auth REST endpoint.
router.post('/', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ error: 'refresh_token required' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Server not configured' });

  try {
    const resp = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${serviceKey}`,
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token }).toString(),
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json(data);
    return res.json(data);
  } catch (err: any) {
    console.error('Refresh error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
