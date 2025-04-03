import { describe, it, expect } from '@jest/globals';
import Question from '../Question';
import mongoose from 'mongoose';

// Define an interface for the Question document
interface IQuestion extends mongoose.Document {
  questionText: string;
  options: string[];
  correctAnswer: string;
  level: number;
}

describe('Question Model', () => {
  describe('Question schema validation', () => {
    it('should create a valid question', async () => {
      const questionData = {
        questionText: 'What is 2+2?',
        options: ['1', '3', '4', '5'],
        correctAnswer: '4',
        level: 1
      };
      
      const validQuestion = new Question(questionData);
      const savedQuestion = await validQuestion.save() as IQuestion;
      
      expect(savedQuestion._id).toBeDefined();
      expect(savedQuestion.questionText).toBe(questionData.questionText);
      expect(savedQuestion.options).toHaveLength(4);
      expect(savedQuestion.correctAnswer).toBe(questionData.correctAnswer);
      expect(savedQuestion.level).toBe(questionData.level);
    });
    
    it('should fail validation without required fields', async () => {
      const invalidQuestion = new Question({});
      
      let validationError: any;
      try {
        await invalidQuestion.save();
      } catch (error) {
        validationError = error;
      }
      
      expect(validationError).toBeDefined();
      expect(validationError.name).toBe('ValidationError');
    });
    
    it('should validate level is a number', async () => {
      const invalidQuestion = new Question({
        questionText: 'Invalid level question',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        level: 'not-a-number'
      } as any); // Use type assertion to bypass TypeScript check for test
      
      let validationError: any;
      try {
        await invalidQuestion.save();
      } catch (error) {
        validationError = error;
      }
      
      expect(validationError).toBeDefined();
      expect(validationError.name).toBe('ValidationError');
    });
  });
});
