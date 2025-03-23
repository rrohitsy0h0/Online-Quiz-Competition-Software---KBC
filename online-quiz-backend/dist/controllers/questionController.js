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
const Question_1 = __importDefault(require("../models/Question"));
const User_1 = __importDefault(require("../models/User")); // Import User model
const timer_1 = require("../utils/timer");
class QuestionController {
    // Method to retrieve all questions
    getAllQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { level } = req.query; // Get the level from query parameters
            try {
                const query = level ? { level: parseInt(level, 10) } : {};
                const questions = yield Question_1.default.find(query); // Fetch questions based on level
                res.status(200).json(questions);
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving questions', error });
            }
        });
    }
    // Method to create a new question
    createQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questionText, options, correctAnswer } = req.body;
            const newQuestion = new Question_1.default({
                questionText,
                options,
                correctAnswer,
            });
            try {
                const savedQuestion = yield newQuestion.save();
                res.status(201).json(savedQuestion);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating question', error });
            }
        });
    }
    // Method to update a question
    updateQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { questionText, options, correctAnswer } = req.body;
            try {
                const updatedQuestion = yield Question_1.default.findByIdAndUpdate(id, { questionText, options, correctAnswer }, { new: true });
                res.status(200).json(updatedQuestion);
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating question', error });
            }
        });
    }
    // Method to delete a question
    deleteQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield Question_1.default.findByIdAndDelete(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting question', error });
            }
        });
    }
    // Method to get a question by ID
    getQuestionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const question = yield Question_1.default.findById(id);
                if (!question) {
                    return res.status(404).json({ message: 'Question not found' });
                }
                res.status(200).json(question);
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving question', error });
            }
        });
    }
    // Method to use a lifeline
    useLifeline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { lifelineType, questionId } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Check if the lifeline has already been used
                if (user.lifelinesUsed.get(lifelineType)) {
                    return res.status(400).json({ message: `Lifeline '${lifelineType}' has already been used.` });
                }
                const question = yield Question_1.default.findById(questionId);
                if (!question) {
                    return res.status(404).json({ message: 'Question not found' });
                }
                let lifelineResult;
                if (lifelineType === '5050') {
                    // Changed: For 50:50, select one random incorrect option so result has 2 options in total
                    const incorrectOptions = question.options.filter(opt => opt !== question.correctAnswer);
                    const randomIncorrectOption = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 1);
                    lifelineResult = [question.correctAnswer, ...randomIncorrectOption].sort(() => 0.5 - Math.random());
                }
                else {
                    return res.status(400).json({ message: 'Invalid lifeline type' });
                }
                // Mark the lifeline as used
                user.lifelinesUsed.set(lifelineType, true);
                yield user.save();
                res.status(200).json({ message: 'Lifeline used successfully', lifelineType, result: lifelineResult });
            }
            catch (error) {
                console.error('Error using lifeline:', error);
                res.status(500).json({ message: 'Error using lifeline', error });
            }
        });
    }
    // Method to navigate to the next question
    nextQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                user.currentQuestionIndex += 1;
                yield user.save();
                const question = yield Question_1.default.findOne().skip(user.currentQuestionIndex);
                if (!question) {
                    return res.status(404).json({ message: 'No more questions available' });
                }
                // Assign time limit based on question index
                let timeLimit;
                if (user.currentQuestionIndex < 5) {
                    timeLimit = 30; // First 5 questions: 30 seconds
                }
                else if (user.currentQuestionIndex < 10) {
                    timeLimit = 45; // Next 5 questions: 45 seconds
                }
                else if (user.currentQuestionIndex < 12) {
                    timeLimit = 90; // Next 2 questions: 90 seconds
                }
                else {
                    timeLimit = null; // Last 4 questions: No time limit
                }
                // Start the timer for the question
                if (timeLimit) {
                    (0, timer_1.startQuestionTimer)(timeLimit, () => __awaiter(this, void 0, void 0, function* () {
                        console.log(`Time's up for question ${user.currentQuestionIndex}`);
                        // Mark the participant as having lost
                        user.score = 0; // Reset score
                        user.currentQuestionIndex = 0; // Reset question index
                        yield user.save();
                        console.log(`User ${user.username} has lost the game due to timeout.`);
                    }));
                }
                res.status(200).json({ question, timeLimit });
            }
            catch (error) {
                res.status(500).json({ message: 'Error navigating to next question', error });
            }
        });
    }
    // Method to answer a question
    answerQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { questionId, answer, lifelineUsed } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const question = yield Question_1.default.findById(questionId);
                if (!question) {
                    return res.status(404).json({ message: 'Question not found' });
                }
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                if (lifelineUsed) {
                    if (user.lifelinesUsed.size >= 4) {
                        return res.status(400).json({ message: 'No lifelines remaining' });
                    }
                    user.lifelinesUsed.set(lifelineUsed, true);
                    yield user.save();
                }
                if (question.correctAnswer !== answer) {
                    return res.status(400).json({ message: 'Wrong answer. Redirecting to dashboard.' });
                }
                // Increment score for correct answer using level-based points
                const points = question.level * 1000;
                user.score += points;
                // Save the updated user state
                yield user.save();
                // Check if the user has completed all questions for the current level
                const totalQuestionsForLevel = yield Question_1.default.countDocuments({ level: question.level });
                if (user.currentQuestionIndex + 1 >= totalQuestionsForLevel) {
                    user.currentQuestionIndex = 0; // Reset for next level
                    yield user.save();
                    return res.status(200).json({
                        message: 'Level completed! Proceeding to the next level.',
                        nextLevel: question.level + 1,
                        currentQuestionIndex: user.currentQuestionIndex,
                        score: user.score // Include updated score in response
                    });
                }
                else {
                    user.currentQuestionIndex += 1;
                }
                yield user.save();
                res.status(200).json({
                    message: 'Correct answer',
                    currentQuestionIndex: user.currentQuestionIndex,
                    score: user.score // Include updated score in response
                });
            }
            catch (error) {
                console.error('Error answering question:', error);
                res.status(500).json({ message: 'Error answering question', error });
            }
        });
    }
    // Method to reset lifelines
    resetLifelines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                user.lifelinesUsed = new Map(); // Reset lifelines used
                yield user.save();
                res.status(200).json({ message: 'Lifelines reset successfully' });
            }
            catch (error) {
                console.error('Error resetting lifelines:', error);
                res.status(500).json({ message: 'Failed to reset lifelines. Please try again later.' });
            }
        });
    }
}
exports.default = new QuestionController();
