import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';

// Route imports
import challengesRouter from './routes/challenges.js';
import startupsRouter from './routes/startups.js';
import applicationsRouter from './routes/applications.js';
import evaluationsRouter from './routes/evaluations.js';
import pilotsRouter from './routes/pilots.js';
import procurementRouter from './routes/procurement.js';
import scaleUpRouter from './routes/scaleUp.js';
import auditLogsRouter from './routes/auditLogs.js';
import notificationsRouter from './routes/notifications.js';
import adminRouter from './routes/admin.js';
import aiMatchingRouter from './routes/aiMatching.js';
import aiChallengeRouter from './routes/aiChallenge.js';
import supabaseRouter from './routes/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
initDb();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Health check endpoints
const healthHandler = (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    product: 'PRAGATI AI Backend API',
    team: 'Pragyan',
    event: 'Smart India Hackathon 2026 Prototype',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'standalone-node',
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.get('/api', healthHandler);

// Mount Routes
app.use('/api/challenges', challengesRouter);
app.use('/api/startups', startupsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/pilots', pilotsRouter);
app.use('/api/procurement', procurementRouter);
app.use('/api/scale-up', scaleUpRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai/matching', aiMatchingRouter);
app.use('/api/ai/challenges', aiChallengeRouter);
app.use('/api/ai/generate-challenge', aiChallengeRouter);
app.use('/api/supabase', supabaseRouter);

// Start server (only in standalone Node mode, not inside Vercel serverless functions)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`PRAGATI AI Backend Server active on http://127.0.0.1:${PORT}`);
    console.log(`Health Check: http://127.0.0.1:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

export default app;
