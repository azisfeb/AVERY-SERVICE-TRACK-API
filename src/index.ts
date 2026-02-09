import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import { verifyJWT } from './middleware/jwt';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize Supabase client for possible DB interactions
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Public routes
app.use('/auth', authRouter);

// Protected example route
app.get('/api/health', verifyJWT, (_req, res) => {
  res.json({ status: 'ok', service: 'avery-service-track-api' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
