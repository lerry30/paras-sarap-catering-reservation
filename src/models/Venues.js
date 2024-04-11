import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const venueSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    address: {
        street: {
            type: String,
            required: true
        },

        barangay: {
            type: String,
            required: true
        },

        municipality: {
            type: String,
            required: true
        },

        province: {
            type: String,
            required: true
        },

        region: {
            type: String,
            required: true
        }
    },

    filename: {
        type: String,
        required: true
    },

    maximumSeatingCapacity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    chargeForTablesAndChairs: Number,

    status: {
        type: String,
        enum: [ 'available', 'unavailable' ],
        default: 'available'
    },
}, {
    timestamps: true
});

const Venue = mongoose.models.Venue || mongoose.model('Venue', venueSchema);
export default Venue;