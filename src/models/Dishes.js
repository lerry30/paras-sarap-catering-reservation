import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    allergens: {
        type: [],
        require: true
    },

    filename: {
        type: String,
        required: true
    },

    costperhead: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [ 'available', 'unavailable' ],
        default: 'available'
    },
}, {
    timestamps: true
});

const Dish = mongoose?.models?.Dish || mongoose.model('Dish', dishSchema);
export default Dish;
