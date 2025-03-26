"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboardController_1 = __importDefault(require("../controllers/leaderboardController")); // Import the default instance
const router = (0, express_1.Router)();
// Currently, no authMiddleware is applied, but it can be added if required.
// Route to get the leaderboard
router.get('/', leaderboardController_1.default.getLeaderboard);
// Route to add a score to the leaderboard
router.post('/add', leaderboardController_1.default.addScore);
exports.default = router;
