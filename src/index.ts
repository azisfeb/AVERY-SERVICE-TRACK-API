import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import { verifySupabaseJWT } from './middleware/jwt';
import { supabase } from './lib/supabase';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Public routes
app.use('/auth', authRouter);
app.use('/auth/refresh', require('./routes/refresh').default);

// Example admin-only route
import requireAdmin from './middleware/roles';
app.get('/api/admin-only', verifySupabaseJWT, requireAdmin, (_req, res) => {
  res.json({ secret: 'only admins see this' });
});

// Protected example route using Supabase JWT verification
app.get('/api/health', verifySupabaseJWT, (_req, res) => {
  res.json({ status: 'ok', service: 'avery-service-track-api' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
