import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const messageSchema = new Schema({
    from: {
        type: String,
        required: true,
    },

    to: {
        type: String,
        required: true,
    },

    filename: String,

    message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [ 'sent', 'unsent' ],
        default: 'unsent'
    },

    viewed: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true
});

const Message = mongoose?.models?.Message || mongoose.model('Message', messageSchema);
export default Message;
