import { Request, Response } from 'express';
import Question from '../models/Question';
import User from '../models/User'; // Import User model
import { startQuestionTimer } from '../utils/timer';
import Leaderboard from '../models/Leaderboard'; // Import Leaderboard model

interface AuthenticatedRequest extends Request {
    user?: { id: string; username: string }; // Ensure consistency with index.d.ts
}

class QuestionController {
    // Method to retrieve all questions
    async getAllQuestions(req: Request, res: Response) {
        const { level } = req.query; // Get the level from query parameters
        try {
            const query = level ? { level: parseInt(level as string, 10) } : {};
            const questions = await Question.find(query); // Fetch questions based on level
            res.status(200).json(questions);
        } catch (error) {
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
                // Changed: For 50:50, select one random incorrect option so result has 2 options in total
                const incorrectOptions = question.options.filter(opt => opt !== question.correctAnswer);
                const randomIncorrectOption = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 1);
                lifelineResult = [question.correctAnswer, ...randomIncorrectOption].sort(() => 0.5 - Math.random());
            } else {
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
                // Add or update leaderboard when the quiz ends
                await this.updateLeaderboard(user);
                return res.status(400).json({ message: 'Wrong answer. Redirecting to dashboard.' });
            }

            // Increment score for correct answer using level-based points
            const points = question.level * 1000;
            user.score += points;

            // Save the updated user state
            await user.save();

            // Check if the user has completed all questions for the current level
            const totalQuestionsForLevel = await Question.countDocuments({ level: question.level });
            if (user.currentQuestionIndex + 1 >= totalQuestionsForLevel) {
                user.currentQuestionIndex = 0; // Reset for next level
                await user.save();

                // Add or update leaderboard when the quiz ends
                await this.updateLeaderboard(user);

                return res.status(200).json({
                    message: 'Level completed! Proceeding to the next level.',
                    nextLevel: question.level + 1,
                    currentQuestionIndex: user.currentQuestionIndex,
                    score: user.score // Include updated score in response
                });
            } else {
                user.currentQuestionIndex += 1;
            }

            await user.save();

            res.status(200).json({ 
                message: 'Correct answer',
                currentQuestionIndex: user.currentQuestionIndex,
                score: user.score // Include updated score in response
            });
        } catch (error) {
            console.error('Error answering question:', error);
            res.status(500).json({ message: 'Error answering question', error });
        }
    }

    // Add or update leaderboard
    private async updateLeaderboard(user: any) {
        const existingEntry = await Leaderboard.findOne({ username: user.username });

        if (existingEntry) {
            // Update the leaderboard entry if the current score is higher than the maxScore
            if (user.score > existingEntry.maxScore) {
                existingEntry.maxScore = user.score;
                existingEntry.timeTaken = user.timeTaken; // Update timeTaken for the new max score
                await existingEntry.save();
                console.log(`Leaderboard updated for user: ${user.username}, new maxScore: ${user.score}`);
            }
        } else {
            // Add a new leaderboard entry
            const newEntry = new Leaderboard({
                username: user.username,
                maxScore: user.score,
                timeTaken: user.timeTaken,
            });
            await newEntry.save();
            console.log(`New leaderboard entry created for user: ${user.username}, maxScore: ${user.score}`);
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

    // Method to reset the user's score
    async resetScore(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.score = 0; // Reset the score to 0
            user.currentQuestionIndex = 0; // Reset the question index
            await user.save();

            console.log(`Score reset for user: ${user.username}`); // Debugging log
            res.status(200).json({ message: 'Score reset successfully' });
        } catch (error) {
            console.error('Error resetting score:', error);
            res.status(500).json({ message: 'Failed to reset score. Please try again later.' });
        }
    }
}

export default new QuestionController();