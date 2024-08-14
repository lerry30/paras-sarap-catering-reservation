import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const menuSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    dishes: {
        type: [],
        required: true
    },

    drinks: {
        type: [],
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

const Menu = mongoose?.models?.Menu || mongoose.model('Menu', menuSchema);
export default Menu;
