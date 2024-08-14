import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const weddingThemeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    filename: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const WeddingTheme = mongoose?.models?.WeddingTheme || mongoose.model('WeddingTheme', weddingThemeSchema);
export default WeddingTheme;
