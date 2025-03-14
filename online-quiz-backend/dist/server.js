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
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to the database
(0, db_1.default)();
// Middleware to parse JSON
app.use(express_1.default.json());
// Define routes
app.use('/api/auth', authRoutes_1.default); // Use authRoutes
app.use('/api/questions', questionRoutes_1.default); // Use questionRoutes
// app.use('/api/leaderboard', leaderboardRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
