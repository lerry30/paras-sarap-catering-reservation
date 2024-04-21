import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const reservationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },

    venue: {},

    menu: {
        name: String,
        description: String,
        listofdishes: [],
        listofdrinks: [],
    },

    date: {
        day: {
            type: String,
            required: true,
        },

        time: {
            from: {
                type: String,
                required: true,
            },

            to: {
                type: String,
                required: true,
            }
        }
    },

    noofguest: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'pending', 'denied', 'accepted' ],
        default: 'pending'
    },
}, {
    timestamps: true
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
export default Reservation;