import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    currentQuestionIndex: {
        type: Number,
        default: 0, // Tracks the current question index
    },
    lifelinesUsed: {
        type: Map,
        of: Boolean, // Tracks whether a specific lifeline has been used
        default: {
            '5050': false,
            'audiencePoll': false,
            'changeQuestion': false,
        },
    },
    timeTaken: {
        type: Number,
        default: 0, // Tracks the total time taken by the user
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;