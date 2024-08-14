import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const kidThemeSchema = new Schema({
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

const KidTheme = mongoose?.models?.KidTheme || mongoose.model('KidTheme', kidThemeSchema);
export default KidTheme;
