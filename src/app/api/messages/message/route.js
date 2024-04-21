import User from '@/models/Users';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    try {    
        const requestObject = await request.json();
        const recipientIdEnc = requestObject?.userId;
        const recipientId = jwt.verify(recipientIdEnc, process.env.ACTION_KEY)?.recipientId || '';
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
        recipientChats[recipientIdEnc] = { recipient: userData, messages: [], replies: [] };
        
        return NextResponse.json({ message: '', data: recipientChats }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}