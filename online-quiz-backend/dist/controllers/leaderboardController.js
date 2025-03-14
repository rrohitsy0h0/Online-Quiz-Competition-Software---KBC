"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Leaderboard_1 = __importDefault(require("../models/Leaderboard"));
class LeaderboardController {
    // Method to get the leaderboard
    getLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leaderboard = yield Leaderboard_1.default.find()
                    .sort({ score: -1, timeTaken: 1 }) // Rank by score, then by minimum time
                    .limit(10);
                res.status(200).json(leaderboard);
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving leaderboard', error });
            }
        });
    }
    // Method to add a score to the leaderboard
    addScore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, score, timeTaken } = req.body;
            try {
                const newEntry = new Leaderboard_1.default({ userId, score, timeTaken });
                yield newEntry.save();
                res.status(201).json({ message: 'Score added successfully', entry: newEntry });
            }
            catch (error) {
                res.status(500).json({ message: 'Error adding score', error });
            }
        });
    }
    // Method to get a user's score
    getUserScore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const userScore = yield Leaderboard_1.default.findOne({ userId });
                if (!userScore) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json(userScore);
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving user score', error });
            }
        });
    }
}
exports.default = new LeaderboardController();
