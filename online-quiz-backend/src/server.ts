import express from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; // Import authRoutes
import questionRoutes from './routes/questionRoutes'; // Import questionRoutes
import leaderboardRoutes from './routes/leaderboardRoutes'; // Import leaderboardRoutes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes); // Use authRoutes
app.use('/api/questions', questionRoutes); // Use questionRoutes
app.use('/api/leaderboard', leaderboardRoutes); // Use leaderboardRoutes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
