import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const debutThemeSchema = new Schema({
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

const DebutTheme = mongoose?.models?.DebutTheme || mongoose.model('DebutTheme', debutThemeSchema);
export default DebutTheme;
