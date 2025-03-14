import { Router } from 'express';
import leaderboardController from '../controllers/leaderboardController'; // Import the default instance

const router = Router();

// Route to get the leaderboard
router.get('/', leaderboardController.getLeaderboard);

// Route to add a score to the leaderboard
router.post('/add', leaderboardController.addScore);

export default router;