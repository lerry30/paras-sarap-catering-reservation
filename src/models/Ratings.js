import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const ratingSchema = new Schema({
    userId: {
        type: String,
        required: true
    },

    reservationId: {
        type: String,
        required: true
    },

    point: {
        type: Number,
        required: true
    },

    message: String
}, {
    timestamps: true
});

const Rating = mongoose?.models?.Rating || mongoose.model('Rating', ratingSchema);
export default Rating;
