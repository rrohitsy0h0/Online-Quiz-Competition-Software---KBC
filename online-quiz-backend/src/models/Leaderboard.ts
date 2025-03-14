import mongoose, { Schema, Document } from 'mongoose';

interface ILeaderboard extends Document {
    userId: mongoose.Types.ObjectId;
    score: number;
    timeTaken: number;
}

const LeaderboardSchema: Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true }
}, { timestamps: true });

const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);

export default Leaderboard;