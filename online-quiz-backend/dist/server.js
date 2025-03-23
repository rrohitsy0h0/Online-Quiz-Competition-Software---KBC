"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Import authRoutes
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes")); // Import questionRoutes
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes")); // Import leaderboardRoutes
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to the database
(0, db_1.default)();
// Middleware to parse JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Ensure CORS is enabled
// Define routes
app.use('/api/auth', authRoutes_1.default); // Use authRoutes
app.use('/api/questions', questionRoutes_1.default); // Use questionRoutes
app.use('/api/leaderboard', leaderboardRoutes_1.default); // Use leaderboardRoutes
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
