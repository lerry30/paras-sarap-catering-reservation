import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        console.log('Database connection status: ', mongoose.STATES[mongoose.connection.readyState]);
        if(mongoose.connection.readyState == 0) // is disconnected
            await mongoose.connect(process.env.MONGODB_URI);

        console.log('+-----------------------------+');
        console.log('| Database connection status: ', mongoose.STATES[mongoose.connection.readyState]);
        console.log('+-----------------------------+');
    } catch(error) {
        console.log(error);
    }
}

export default connectToDatabase;