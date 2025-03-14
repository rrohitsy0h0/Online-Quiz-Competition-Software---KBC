import { Request, Response } from 'express';
import Leaderboard from '../models/Leaderboard';

class LeaderboardController {
    // Method to get the leaderboard
    async getLeaderboard(req: Request, res: Response) {
        try {
            const leaderboard = await Leaderboard.find()
                .sort({ score: -1, timeTaken: 1 }) // Rank by score, then by minimum time
                .limit(10);
            res.status(200).json(leaderboard);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving leaderboard', error });
        }
    }

    // Method to add a score to the leaderboard
    async addScore(req: Request, res: Response) {
        const { userId, score, timeTaken } = req.body;

        try {
            const newEntry = new Leaderboard({ userId, score, timeTaken });
            await newEntry.save();
            res.status(201).json({ message: 'Score added successfully', entry: newEntry });
        } catch (error) {
            res.status(500).json({ message: 'Error adding score', error });
        }
    }
}

export default new LeaderboardController();