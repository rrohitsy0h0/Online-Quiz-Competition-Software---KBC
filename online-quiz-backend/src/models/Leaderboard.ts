import mongoose, { Schema, Document } from 'mongoose';

interface ILeaderboard extends Document {
    username: string;
    maxScore: number; // Store the maximum score ever achieved
    timeTaken: number; // Store the time taken for the max score
}

const leaderboardSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    maxScore: {
        type: Number,
        required: true,
    },
    timeTaken: {
        type: Number,
        required: true,
    },
});

const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);

export default Leaderboard;