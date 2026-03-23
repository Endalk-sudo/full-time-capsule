import express from 'express';
import capsuleRouter from './routes/capsule.routes.js';
import authRouter from './routes/auth.routes.js';
import s3Router from './routes/s3.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
    }),
);

app.use(express.json());

app.get('/api/health_check', (req, res) => {
    res.json({ result: 'Everything is running correctly :)' });
});

app.use('/api/auth', authRouter);

app.use('/api', s3Router);

app.use('/api/capsule', capsuleRouter);

app.use(errorHandler);

export default app;
