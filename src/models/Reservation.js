import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const reservationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },

    event: {
        type: String,
        required: true,
    },

    theme: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
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
            },
        },

        timeExtension: {
            type: String,
            required: true
        }
    },

    noofguest: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'pending', 'rejected', 'approved', 'expired' ],
        default: 'pending'
    },
}, {
    timestamps: true
});

const Reservation = mongoose?.models?.Reservation || mongoose.model('Reservation', reservationSchema);
export default Reservation;
