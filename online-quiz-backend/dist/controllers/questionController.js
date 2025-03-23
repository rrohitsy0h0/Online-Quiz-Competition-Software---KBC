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
            const { lifelineType } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                if (user.lifelinesUsed >= 4) {
                    return res.status(400).json({ message: 'No lifelines remaining' });
                }
                user.lifelinesUsed += 1;
                yield user.save();
                let lifelineResult;
                switch (lifelineType) {
                    case '5050':
                        lifelineResult = '50:50 lifeline used';
                        break;
                    case 'phoneAFriend':
                        lifelineResult = 'Phone a Friend lifeline used';
                        break;
                    case 'audiencePoll':
                        lifelineResult = 'Audience Poll lifeline used';
                        break;
                    case 'changeQuestion': {
                        // Flip the question logic
                        const currentQuestion = yield Question_1.default.findOne().skip(user.currentQuestionIndex);
                        if (!currentQuestion) {
                            return res.status(404).json({ message: 'Current question not found' });
                        }
                        const currentQuestionObj = currentQuestion.toObject(); // Convert to plain object
                        const flippedQuestion = yield Question_1.default.aggregate([
                            { $match: { level: currentQuestionObj.level, _id: { $ne: currentQuestionObj._id } } },
                            { $sample: { size: 1 } }
                        ]);
                        if (!flippedQuestion.length) {
                            return res.status(404).json({ message: 'No alternative questions available' });
                        }
                        lifelineResult = 'Question flipped successfully';
                        return res.status(200).json({ message: lifelineResult, question: flippedQuestion[0] });
                    }
                    default:
                        return res.status(400).json({ message: 'Invalid lifeline type' });
                }
                res.status(200).json({ message: lifelineResult });
            }
            catch (error) {
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
                    if (user.lifelinesUsed >= 4) {
                        return res.status(400).json({ message: 'No lifelines remaining' });
                    }
                    user.lifelinesUsed += 1;
                    yield user.save();
                }
                if (question.correctAnswer !== answer) {
                    return res.status(400).json({ message: 'Wrong answer. Game over.' });
                }
                user.score += 1; // Increment score for correct answer
                yield user.save();
                res.status(200).json({ message: 'Correct answer' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error answering question', error });
            }
        });
    }
}
exports.default = new QuestionController();
