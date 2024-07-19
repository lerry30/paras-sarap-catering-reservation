import mongoose, { Schema } from 'mongoose';
import connectToDatabase from '@/utils/databaseConnection';

mongoose.Promise = global.Promise;
connectToDatabase();

const policySchema = new Schema({
    timelimitedserviceinhours: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Policy = mongoose.models.Policy || mongoose.model('Policy', policySchema);
export default Policy;
