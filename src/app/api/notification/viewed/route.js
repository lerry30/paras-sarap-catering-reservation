import { NextResponse } from 'next/server';
import Message from '@/models/Message';

import { decodeUserIdFromHeader } from '@/utils/auth/decode';

const seenNotification = {
    messages: async (userId) => {
        await Message.updateMany({ to: userId, viewed: false }, { viewed: true });
    }
}

export const POST = async (request) => {
    try {
        const viewedNotif = await request?.json();
        const notif = String(viewedNotif?.notif);

        const userId = decodeUserIdFromHeader();

        await seenNotification[notif](userId);

        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}
