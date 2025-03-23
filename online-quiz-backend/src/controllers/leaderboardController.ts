import { Request, Response } from 'express';
import Leaderboard from '../models/Leaderboard';

class LeaderboardController {
    async getLeaderboard(req: Request, res: Response) {
        try {
            // Fetch leaderboard sorted by maxScore in descending order
            const leaderboard = await Leaderboard.find().sort({ maxScore: -1 }).limit(10);
            console.log('Fetched leaderboard:', leaderboard); // Debugging log
            res.status(200).json(leaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            res.status(500).json({ message: 'Error fetching leaderboard' });
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