import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const privateThemeSchema = new Schema({
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

const PrivateTheme = mongoose?.models?.PrivateTheme || mongoose.model('PrivateTheme', privateThemeSchema);
export default PrivateTheme;
