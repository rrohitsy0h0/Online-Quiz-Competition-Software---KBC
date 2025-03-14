import express from 'express';
import authController from '../controllers/authController'; // Import the instance

const router = express.Router();

// User registration route
router.post('/register', authController.register);

// User login route
router.post('/login', authController.login);

export default router;