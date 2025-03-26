import { Router } from 'express';
import leaderboardController from '../controllers/leaderboardController'; // Import the default instance

const router = Router();

// Currently, no authMiddleware is applied, but it can be added if required.

// Route to get the leaderboard
router.get('/', leaderboardController.getLeaderboard);

// Route to add a score to the leaderboard
router.post('/add', leaderboardController.addScore);

export default router;