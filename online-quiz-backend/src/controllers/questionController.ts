import { Request, Response } from 'express';
import Question from '../models/Question';
import User from '../models/User'; // Import User model
import { startQuestionTimer } from '../utils/timer';

interface AuthenticatedRequest extends Request {
    user?: { id: string; username: string }; // Ensure consistency with index.d.ts
}

class QuestionController {
    // Method to retrieve all questions
    async getAllQuestions(req: Request, res: Response) {
        const { level } = req.query; // Get the level from query parameters
        console.log(`Fetching questions for level: ${level}`);
        try {
            const query = level ? { level: parseInt(level as string, 10) } : {};
            console.log('MongoDB query:', query);
            // Return all questions for the level (remove .limit(1))
            const questions = await Question.find(query);
            console.log(`Found ${questions.length} questions`);
            res.status(200).json(questions);
        } catch (error) {
            console.error('Error retrieving questions:', error);
            res.status(500).json({ message: 'Error retrieving questions', error });
        }
    }

    // Method to create a new question
    async createQuestion(req: Request, res: Response) {
        const { questionText, options, correctAnswer } = req.body;

        const newQuestion = new Question({
            questionText,
            options,
            correctAnswer,
        });

        try {
            const savedQuestion = await newQuestion.save();
            res.status(201).json(savedQuestion);
        } catch (error) {
            res.status(500).json({ message: 'Error creating question', error });
        }
    }

    // Method to update a question
    async updateQuestion(req: Request, res: Response) {
        const { id } = req.params;
        const { questionText, options, correctAnswer } = req.body;

        try {
            const updatedQuestion = await Question.findByIdAndUpdate(
                id,
                { questionText, options, correctAnswer },
                { new: true }
            );
            res.status(200).json(updatedQuestion);
        } catch (error) {
            res.status(500).json({ message: 'Error updating question', error });
        }
    }

    // Method to delete a question
    async deleteQuestion(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await Question.findByIdAndDelete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting question', error });
        }
    }

    // Method to get a question by ID
    async getQuestionById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const question = await Question.findById(id);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json(question);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving question', error });
        }
    }

    // Method to use a lifeline
    async useLifeline(req: AuthenticatedRequest, res: Response) {
        const { lifelineType, questionId } = req.body;
        const userId = req.user?.id;

        console.log(`Lifeline requested: ${lifelineType}, Question ID: ${questionId}`); // Add this debug log

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the lifeline has already been used
            if (user.lifelinesUsed.get(lifelineType)) {
                return res.status(400).json({ message: `Lifeline '${lifelineType}' has already been used.` });
            }

            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            let lifelineResult;
            if (lifelineType === '5050') {
                // For 50:50, select one random incorrect option so result has 2 options in total
                const incorrectOptions = question.options.filter(opt => opt !== question.correctAnswer);
                const randomIncorrectOption = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 1);
                lifelineResult = [question.correctAnswer, ...randomIncorrectOption].sort(() => 0.5 - Math.random());
            } else if (lifelineType === 'showAnswer') {
                // For Show Answer lifeline, simply return the correct answer
                lifelineResult = question.correctAnswer;
            } else if (lifelineType === 'changeQuestion') {
                console.log('Processing changeQuestion lifeline'); // Add this debug log
                
                // For Flip the Question lifeline, get a different random question of the same level
                const currentLevel = question.level;
                
                console.log(`Finding alternative questions for level ${currentLevel}`); // Add this debug log
                
                // Find all questions of the current level except the current question
                const availableQuestions = await Question.find({
                    level: currentLevel,
                    _id: { $ne: questionId }
                });
                
                console.log(`Found ${availableQuestions.length} alternative questions`); // Add this debug log
                
                if (availableQuestions.length === 0) {
                    return res.status(400).json({ 
                        message: 'No alternative questions available for this level.' 
                    });
                }
                
                // Select a random question from the available questions
                const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                const newQuestion = availableQuestions[randomIndex];
                
                console.log(`Selected new question: ${newQuestion._id}`); // Add this debug log
                
                // Return the new question as the result
                lifelineResult = newQuestion;
            } else {
                console.log(`Unrecognized lifeline type: ${lifelineType}`); // Add this debug log
                return res.status(400).json({ message: 'Invalid lifeline type' });
            }

            // Mark the lifeline as used
            user.lifelinesUsed.set(lifelineType, true);
            await user.save();

            res.status(200).json({ message: 'Lifeline used successfully', lifelineType, result: lifelineResult });
        } catch (error) {
            console.error('Error using lifeline:', error);
            res.status(500).json({ message: 'Error using lifeline', error });
        }
    }

    // Method to navigate to the next question
    async nextQuestion(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.currentQuestionIndex += 1;
            await user.save();

            const question = await Question.findOne().skip(user.currentQuestionIndex);
            if (!question) {
                return res.status(404).json({ message: 'No more questions available' });
            }

            // Assign time limit based on question index
            let timeLimit;
            if (user.currentQuestionIndex < 5) {
                timeLimit = 30; // First 5 questions: 30 seconds
            } else if (user.currentQuestionIndex < 10) {
                timeLimit = 45; // Next 5 questions: 45 seconds
            } else if (user.currentQuestionIndex < 12) {
                timeLimit = 90; // Next 2 questions: 90 seconds
            } else {
                timeLimit = null; // Last 4 questions: No time limit
            }

            // Start the timer for the question
            if (timeLimit) {
                startQuestionTimer(timeLimit, async () => {
                    console.log(`Time's up for question ${user.currentQuestionIndex}`);
                    // Mark the participant as having lost
                    user.score = 0; // Reset score
                    user.currentQuestionIndex = 0; // Reset question index
                    await user.save();
                    console.log(`User ${user.username} has lost the game due to timeout.`);
                });
            }

            res.status(200).json({ question, timeLimit });
        } catch (error) {
            res.status(500).json({ message: 'Error navigating to next question', error });
        }
    }

    // Method to answer a question
    async answerQuestion(req: AuthenticatedRequest, res: Response) {
        const { questionId, answer, lifelineUsed } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (lifelineUsed) {
                if (user.lifelinesUsed.size >= 4) {
                    return res.status(400).json({ message: 'No lifelines remaining' });
                }
                user.lifelinesUsed.set(lifelineUsed, true);
                await user.save();
            }

            if (question.correctAnswer !== answer) {
                return res.status(400).json({ message: 'Wrong answer. Redirecting to dashboard.' });
            }

            // Correct answer: update user's score using level-based points
            const points = question.level * 1000;
            user.score += points;

            // Always move to the next level
            const nextLevel = question.level + 1;
            // Reset currentQuestionIndex (if used elsewhere)
            user.currentQuestionIndex = 0;
            await user.save();

            console.log(`User ${user.username} answered correctly. Moving to level ${nextLevel}.`);
            return res.status(200).json({
                message: 'Correct answer! Moving to next level.',
                nextLevel: nextLevel,
                score: user.score
            });
        } catch (error) {
            console.error('Error answering question:', error);
            res.status(500).json({ message: 'Error answering question', error });
        }
    }

    // Method to reset lifelines
    async resetLifelines(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.lifelinesUsed = new Map(); // Reset lifelines used
            await user.save();

            res.status(200).json({ message: 'Lifelines reset successfully' });
        } catch (error) {
            console.error('Error resetting lifelines:', error);
            res.status(500).json({ message: 'Failed to reset lifelines. Please try again later.' });
        }
    }
}

export default new QuestionController();