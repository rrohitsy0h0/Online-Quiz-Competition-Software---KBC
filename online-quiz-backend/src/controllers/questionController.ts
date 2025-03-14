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
        const { lifelineType } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.lifelinesUsed >= 4) {
                return res.status(400).json({ message: 'No lifelines remaining' });
            }

            user.lifelinesUsed += 1;
            await user.save();

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
                    const currentQuestion = await Question.findOne().skip(user.currentQuestionIndex);
                    if (!currentQuestion) {
                        return res.status(404).json({ message: 'Current question not found' });
                    }

                    const currentQuestionObj = currentQuestion.toObject(); // Convert to plain object
                    const flippedQuestion = await Question.aggregate([
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
        } catch (error) {
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
                if (user.lifelinesUsed >= 4) {
                    return res.status(400).json({ message: 'No lifelines remaining' });
                }
                user.lifelinesUsed += 1;
                await user.save();
            }

            if (question.correctAnswer !== answer) {
                return res.status(400).json({ message: 'Wrong answer. Game over.' });
            }

            user.score += 1; // Increment score for correct answer
            await user.save();

            res.status(200).json({ message: 'Correct answer' });
        } catch (error) {
            res.status(500).json({ message: 'Error answering question', error });
        }
    }
}

export default new QuestionController();