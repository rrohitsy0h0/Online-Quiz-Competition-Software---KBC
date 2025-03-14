"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboardController_1 = __importDefault(require("../controllers/leaderboardController"));
const router = (0, express_1.Router)();
const leaderboardController = new leaderboardController_1.default();
// Route to get the leaderboard
router.get('/', leaderboardController.getLeaderboard);
// Route to add a score to the leaderboard
router.post('/add', leaderboardController.addScore);
exports.default = router;
