import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
// CRUD routes are public for isolated practice. See Protected Routes to add requireAuth.
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorMiddleware);
export default app;
