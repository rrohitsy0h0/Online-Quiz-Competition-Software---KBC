import express from 'express';
import connectDB from './config/db'; // Fix the import
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Export the app
export default app;