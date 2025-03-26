import express from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; 
import questionRoutes from './routes/questionRoutes';
// Remove leaderboardRoutes import
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true,
})); // Ensure CORS is enabled

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
// Remove leaderboard routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
