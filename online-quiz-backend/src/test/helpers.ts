import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';

// Helper to create a test user and get auth token
export const createUserAndGetToken = async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  
  const user = await User.create({
    _id: userId,
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '1d' }
  );

  return { user, token };
};
