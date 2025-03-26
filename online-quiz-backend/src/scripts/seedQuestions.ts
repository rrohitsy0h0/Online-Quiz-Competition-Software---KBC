import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question';

dotenv.config();

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

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.log('Connected to MongoDB');
    await Question.deleteMany(); // Clear existing questions
    console.log('Existing questions cleared');

    await Question.insertMany(questions); // Insert new questions
    console.log('Questions seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();
