"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    currentQuestionIndex: {
        type: Number,
        default: 0, // Tracks the current question index
    },
    lifelinesUsed: {
        type: Map,
        of: Boolean,
        default: {
            '5050': false,
            'audiencePoll': false,
            'changeQuestion': false, // This should match exactly
            'showAnswer': false,
        },
    },
    timeTaken: {
        type: Number,
        default: 0, // Tracks the total time taken by the user
    }
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
