import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const drinkSchema = new Schema({
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

    costperhead: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Drink = mongoose.models.Drink || mongoose.model('Drink', drinkSchema);
export default Drink;