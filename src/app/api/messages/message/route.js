import User from '@/models/Users';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    try {    
        const isAnAdmin = await apiIsAnAdmin(request);
        if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const requestObject = await request.json();
        const recipientId = requestObject?.userId;
        const recipientChats = {};

        if(!recipientId) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const user = await User.findById(recipientId);
        const firstname = user?.firstname || '';
        const lastname = user?.lastname || '';
        const email = user?.email || '';
        const filename = user?.filename || '';
        const status = user?.status || 'active';
        const createdAt = user?.createdAt || '';

        const userData = { firstname, lastname, email, filename, status, createdAt };
        recipientChats[recipientId] = { recipient: userData, messages: [], replies: [] };
        
        return NextResponse.json({ message: '', data: recipientChats }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}