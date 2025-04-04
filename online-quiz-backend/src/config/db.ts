import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://rrohitsatpute:r85Qn3nzyp8MR8qF@kbc.9w3zz.mongodb.net/quizdb?retryWrites=true&w=majority&appName=KBC'|| 'mongodb://localhost:27017/online-quiz';
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;