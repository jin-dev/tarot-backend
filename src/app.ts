import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import  tarotRoutes  from './routes/tarot.routes';


dotenv.config();

const app: Application = express();

app.use(helmet());

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://tarotflows.com' : '*',
  credentials: true,
}));

app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 requests per 15 minutes
  message: { error: 'Too many requests. Please try again later.' },
});

app.use('/api/', apiLimiter);

// ==========================================
// 2. Routing
// ==========================================

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Tarot API Server is running! 🔮');
});

// Tarot routes
app.use('/api/tarot', tarotRoutes);

// ==========================================
// 3. Start server
// ==========================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;