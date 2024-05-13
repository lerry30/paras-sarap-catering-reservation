import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const reservationRejectionReasonSchema = new Schema({
    reservationId: {
        type: String,
        required: true,
        unique: true
    },

    reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const reservationRejectionReason = mongoose.models.reservationRejectionReason || mongoose.model('reservationRejectionReason', reservationRejectionReasonSchema);
export default reservationRejectionReason;