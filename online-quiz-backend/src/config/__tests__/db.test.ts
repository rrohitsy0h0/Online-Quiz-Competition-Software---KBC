import connectDB from '../db';
import mongoose from 'mongoose';
import { describe, beforeEach, jest, it,expect } from '@jest/globals';

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB successfully', async () => {
    const testUri = 'mongodb+srv://rrohitsatpute:r85Qn3nzyp8MR8qF@kbc.9w3zz.mongodb.net/quizdb?retryWrites=true&w=majority&appName=KBC';
    process.env.MONGO_URI = testUri;
    // Spy on mongoose.connect and have it resolve
    const mongooseConnectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce(mongoose as mongoose.Mongoose);
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await connectDB();

    expect(mongooseConnectSpy).toHaveBeenCalledWith(testUri);
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB connected successfully');
  });

  it('should exit process on connection error', async () => {
    const errorMessage = 'Connection failed';
    // Make mongoose.connect reject with an error
    const mongooseConnectSpy = jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error(errorMessage));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((...args: unknown[]) => {
      const code = args[0] as number | undefined;
      throw new Error(`process.exit: ${code}`);
    });
    
    try {
      await connectDB();
    } catch (e) {
      expect(e).toEqual(new Error('process.exit: 1'));
    }
    
    expect(mongooseConnectSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('MongoDB connection error:', expect.any(Error));
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
