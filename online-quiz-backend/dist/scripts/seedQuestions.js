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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Question_1 = __importDefault(require("../models/Question"));
dotenv_1.default.config();
const questions = [
    // Level 1
    {
        questionText: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
        level: 1,
        timeLimit: 30,
    },
    {
        questionText: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        level: 1,
        timeLimit: 30,
    },
    // Add 8 more questions for level 1
    {
        questionText: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Jupiter",
        level: 1,
        timeLimit: 30,
    },
    // ... Add more questions for level 1 ...
    // Level 2
    {
        questionText: "What is the chemical symbol for water?",
        options: ["H2O", "O2", "CO2", "NaCl"],
        correctAnswer: "H2O",
        level: 2,
        timeLimit: 30,
    },
    {
        questionText: "Who wrote 'Romeo and Juliet'?",
        options: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
        correctAnswer: "William Shakespeare",
        level: 2,
        timeLimit: 30,
    },
    // Add 8 more questions for level 2
    {
        questionText: "What is the square root of 64?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        level: 2,
        timeLimit: 30,
    },
    // ... Add more questions for level 2 ...
    // Level 3
    {
        questionText: "What is the capital of Japan?",
        options: ["Tokyo", "Kyoto", "Osaka", "Nagoya"],
        correctAnswer: "Tokyo",
        level: 3,
        timeLimit: 30,
    },
    {
        questionText: "What is the speed of light?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
        correctAnswer: "300,000 km/s",
        level: 3,
        timeLimit: 30,
    },
    // Add 8 more questions for level 3
    {
        questionText: "Who painted the Mona Lisa?",
        options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"],
        correctAnswer: "Leonardo da Vinci",
        level: 3,
        timeLimit: 30,
    },
    // ... Add more questions for level 3 ...
    // Repeat similar structure for levels 4 to 16
    {
        questionText: "What is the capital of Italy?",
        options: ["Rome", "Venice", "Milan", "Florence"],
        correctAnswer: "Rome",
        level: 4,
        timeLimit: 30,
    },
    {
        questionText: "What is the boiling point of water in Celsius?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        correctAnswer: "100°C",
        level: 4,
        timeLimit: 30,
    },
    // Add more questions for levels 4 to 16...
];
const seedQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        yield Question_1.default.deleteMany(); // Clear existing questions
        console.log('Existing questions cleared');
        yield Question_1.default.insertMany(questions); // Insert new questions
        console.log('Questions seeded successfully');
        process.exit();
    }
    catch (error) {
        console.error('Error seeding questions:', error);
        process.exit(1);
    }
});
seedQuestions();
