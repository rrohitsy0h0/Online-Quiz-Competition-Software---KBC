import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion extends Document {
    questionText: string;
    options: string[];
    correctAnswer: string;
    timeLimit: number | null; // Time limit for the question in seconds
    level: number; // Level of the question
}

const questionSchema: Schema = new Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    timeLimit: {
        type: Number,
        required: false,
        default: 30, // Default time limit is 30 seconds
    },
    level: {
        type: Number,
        required: true, // Ensure level is required
    },
});

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;