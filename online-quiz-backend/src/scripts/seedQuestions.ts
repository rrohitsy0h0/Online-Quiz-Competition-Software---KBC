import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question';

dotenv.config();

const questions = [
  {
    questionText: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Paris",
    level: 1,
    timeLimit: 30
  },
  {
    questionText: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    level: 1,
    timeLimit: 30
  },
  // Add more questions as needed
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    await Question.deleteMany(); // Clear existing questions
    await Question.insertMany(questions);
    console.log('Questions seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();
