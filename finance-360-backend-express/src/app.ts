import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import transactionRoutes from './routes/transaction.routes';
import budgetRoutes from './routes/budget.routes';
import savingsGoalRoutes from './routes/savingsGoal.routes';
import { errorHandler } from './middleware/error.middleware';
import { sendSuccess, sendError } from './utils/apiResponse';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }, 'Finance 360 Express Backend API is running');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
});

// Centralized Error Middleware
app.use(errorHandler);

export default app;
