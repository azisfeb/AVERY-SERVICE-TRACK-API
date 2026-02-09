import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Simple login that issues JWT if env credentials match.
// Replace this with real user lookup in Supabase for production.
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: '8h'
    });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
