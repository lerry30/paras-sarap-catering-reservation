import Message from '@/models/Message';
import User from '@/models/Users';
import { decodeUserIdFromRequest } from '@/utils/auth/decode';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        // get user id
        const encodedKey = request.cookies.get('user-json-token-key')?.value || '';
        const encodedData = request.cookies.get('user-json-token-data')?.value || '';
        if(!encodedKey || !encodedData) return false;
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);

        const messages = await Message.find({ to: userId });
        const chats = [];
        for(const message of messages) {
            const recipientId = message?.from;
            const user = await User.findById(recipientId);
            const { firstname, lastname, email, status } = user;
            const uMessage = message?.message;
            const userData = { firstname, lastname, email, status, message: uMessage };
            chats.push(userData);
        }

        await User.findByIdAndUpdate(userId, { status: 'active' });

        return NextResponse.json({ message: '', data: chats }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}

export const POST = async (request) => {
    try {
        // get user id
        const encodedKey = request.cookies.get('user-json-token-key')?.value || '';
        const encodedData = request.cookies.get('user-json-token-data')?.value || '';
        if(!encodedKey || !encodedData) return false;
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);

        const jsonData = await request?.json();
        const message = jsonData?.message;
        let recipientId = jsonData?.recipientId || undefined;
        
        if(!message) return NextResponse.json({ message: 'Message is empty' }, { status: 200 });

        if(!recipientId) {
            const admin = await User.find({ admin: true });
            recipientId = admin[0]._id.toString();
        }

        await Message.create({ from: userId, to: recipientId, message });
        return NextResponse.json({ message: '', data: message }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}