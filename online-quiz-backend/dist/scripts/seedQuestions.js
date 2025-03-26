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
        questionText: "What is the largest country in the world by area?",
        options: ["Russia", "China", "United States", "Canada"],
        correctAnswer: "Russia",
        level: 1,
        timeLimit: 30,
    },
    {
        questionText: "Which planet is closest to the sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correctAnswer: "Mercury",
        level: 1,
        timeLimit: 30,
    },
    // Level 2
    {
        questionText: "What is the chemical symbol for water?",
        options: ["H2O", "O2", "CO2", "NaCl"],
        correctAnswer: "H2O",
        level: 2,
        timeLimit: 30,
    },
    // Level 3
    {
        questionText: "What is the capital of Japan?",
        options: ["Tokyo", "Kyoto", "Osaka", "Nagoya"],
        correctAnswer: "Tokyo",
        level: 3,
        timeLimit: 30,
    },
    {
        questionText: "What is the capital of Italy?",
        options: ["Rome", "Venice", "Milan", "Florence"],
        correctAnswer: "Rome",
        level: 4,
        timeLimit: 30,
    },
    {
        questionText: "Which planet is known as the 'Red Planet'?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        level: 5,
        timeLimit: 30,
    },
    {
        questionText: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correctAnswer: "Au",
        level: 6,
        timeLimit: 45,
    },
    {
        questionText: "Who wrote 'Romeo and Juliet'?",
        options: ["William Shakespeare", "Jane Austen", "Charles Dickens", "Mark Twain"],
        correctAnswer: "William Shakespeare",
        level: 7,
        timeLimit: 45,
    },
    {
        questionText: "What is the largest ocean on Earth?",
        options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
        correctAnswer: "Pacific Ocean",
        level: 8,
        timeLimit: 45,
    },
    {
        questionText: "What is the square root of 144?",
        options: ["12", "10", "14", "16"],
        correctAnswer: "12",
        level: 9,
        timeLimit: 45,
    },
    {
        questionText: "Which country is known as the 'Land of the Rising Sun'?",
        options: ["Japan", "China", "Korea", "Vietnam"],
        correctAnswer: "Japan",
        level: 10,
        timeLimit: 45,
    },
    {
        questionText: "What is the largest mammal?",
        options: ["Blue Whale", "Elephant", "Giraffe", "Hippopotamus"],
        correctAnswer: "Blue Whale",
        level: 11,
        timeLimit: 999999, // Very large number for unlimited time
    },
    {
        questionText: "In which year did the Titanic sink?",
        options: ["1912", "1920", "1905", "1931"],
        correctAnswer: "1912",
        level: 12,
        timeLimit: 999999, // Very large number for unlimited time
    },
    {
        questionText: "What is the value of pi (π) to two decimal places?",
        options: ["3.14", "3.16", "3.12", "3.18"],
        correctAnswer: "3.14",
        level: 13,
        timeLimit: 999999, // Very large number for unlimited time
    },
    {
        questionText: "Which gas makes up the majority of Earth's atmosphere?",
        options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
        correctAnswer: "Nitrogen",
        level: 14,
        timeLimit: 999999, // Very large number for unlimited time
    },
    {
        questionText: "What is the capital of Australia?",
        options: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
        correctAnswer: "Canberra",
        level: 15,
        timeLimit: 999999, // Very large number for unlimited time
    },
    {
        questionText: "Who painted the Mona Lisa?",
        options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
        correctAnswer: "Leonardo da Vinci",
        level: 16,
        timeLimit: 999999, // Very large number for unlimited time
    },
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
