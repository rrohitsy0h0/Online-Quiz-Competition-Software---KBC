"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = __importDefault(require("../controllers/questionController")); // Import the instance
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Route to get all questions
router.get('/', authMiddleware_1.authMiddleware, questionController_1.default.getAllQuestions); // Add authMiddleware
// Route to create a new question
router.post('/', authMiddleware_1.authMiddleware, questionController_1.default.createQuestion);
// Route to get a question by ID
router.get('/:id', authMiddleware_1.authMiddleware, questionController_1.default.getQuestionById);
// Route to update a question by ID
router.put('/:id', authMiddleware_1.authMiddleware, questionController_1.default.updateQuestion);
// Route to delete a question by ID
router.delete('/:id', authMiddleware_1.authMiddleware, questionController_1.default.deleteQuestion);
// Route to answer a question
router.post('/answer', authMiddleware_1.authMiddleware, questionController_1.default.answerQuestion);
// Route to use a lifeline
router.post('/lifeline', authMiddleware_1.authMiddleware, questionController_1.default.useLifeline);
// Route to navigate to the next question
router.post('/next', authMiddleware_1.authMiddleware, questionController_1.default.nextQuestion);
exports.default = router;
