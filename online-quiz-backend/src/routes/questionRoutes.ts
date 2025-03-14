import express from 'express';
import questionController from '../controllers/questionController'; // Import the instance
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Route to get all questions
router.get('/', authMiddleware, questionController.getAllQuestions); // Add authMiddleware

// Route to create a new question
router.post('/', authMiddleware, questionController.createQuestion);

// Route to get a question by ID
router.get('/:id', authMiddleware, questionController.getQuestionById);

// Route to update a question by ID
router.put('/:id', authMiddleware, questionController.updateQuestion);

// Route to delete a question by ID
router.delete('/:id', authMiddleware, questionController.deleteQuestion);

// Route to answer a question
router.post('/answer', authMiddleware, questionController.answerQuestion);

// Route to use a lifeline
router.post('/lifeline', authMiddleware, questionController.useLifeline);

// Route to navigate to the next question
router.post('/next', authMiddleware, questionController.nextQuestion);

export default router;