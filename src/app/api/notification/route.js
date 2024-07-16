import { NextResponse } from 'next/server';
import Message from '@/models/Message';

import { decodeUserIdFromHeader } from '@/utils/auth/decode';

export const GET = async (request) => {
    try { 
        const userId = decodeUserIdFromHeader();
        const messages = await Message.find({ to: userId, viewed: false });

        const data = {
            messageCount: messages.length,
        };

        return NextResponse.json({ message: '', data: data }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}
