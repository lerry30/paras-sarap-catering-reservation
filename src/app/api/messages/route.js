import Message from '@/models/Message';
import User from '@/models/Users';
import jwt from 'jsonwebtoken';
import { decodeUserIdFromRequest } from '@/utils/auth/decode';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        // get user id
        const encodedKey = request.cookies.get('user-json-token-key')?.value || '';
        const encodedData = request.cookies.get('user-json-token-data')?.value || '';
        if(!encodedKey || !encodedData) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);
        if(!userId) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
        const user = await User.findById(userId);
        const amIAnAdmin = user?.admin || false;
        
        const messages = await Message.find({ to: userId }) || [];
        const sentMessages = await Message.find({ from: userId }) || [];
        const ensureArrangementOfAnObject = [];
        const recipientChats = {};
        for(const message of messages) {
            const recipientId = message?.from;
            ensureArrangementOfAnObject.push(recipientId);

            const uMessage = message?.message;
            const messagefile = message?.filename;
            const createdAt = message?.createdAt;

            if(!recipientChats[recipientId]?.messages) 
                recipientChats[recipientId] = { ...recipientChats[recipientId], messages: [] };
            const prevMessage = recipientChats[recipientId]?.messages || [];
            recipientChats[recipientId].messages = [ ...prevMessage, { message: uMessage, filename: messagefile, createdAt }];
        }

        for(const sent of sentMessages) {
            const recieverId = sent?.to;
            const uMessage = sent?.message;
            const messagefile = sent?.filename;
            const createdAt = sent?.createdAt;

            ensureArrangementOfAnObject.push(recieverId);

            if(!recipientChats[recieverId]) { 
                recipientChats[recieverId] = {};
            }

            if(!recipientChats[recieverId]?.replies) 
                recipientChats[recieverId] = { ...recipientChats[recieverId], replies: [] };
            const prevReplies = recipientChats[recieverId]?.replies || [];
            recipientChats[recieverId].replies = [ ...prevReplies, { message: uMessage, filename: messagefile, createdAt }];
        }

        const actualSeries = [ ...new Set([ ...ensureArrangementOfAnObject ]) ].reverse();

        const vChats = [];
        for(const recipientId of actualSeries) {
            const user = await User.findById(recipientId);
            const { firstname, lastname, email, filename, status } = user;
            const userData = { firstname, lastname, email, profilePic: filename, status };
            if(!recipientChats[recipientId]?.recipient) 
                recipientChats[recipientId] = { ...recipientChats[recipientId], recipient: {} };  
            recipientChats[recipientId].recipient = userData;

            const nId = amIAnAdmin ? recipientId : jwt.sign({ recipientId }, process.env.ACTION_KEY);
            vChats.push({ [nId]: recipientChats[recipientId] });
        }

        await User.findByIdAndUpdate(userId, { status: 'active' });

        return NextResponse.json({ message: '', data: vChats }, { status: 200 });
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
        if(!encodedKey || !encodedData) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);
        if(!userId) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
        const user = await User.findById(userId);

        const jsonData = await request?.json();
        const message = jsonData?.message?.trim();
        let recipientId = jsonData?.recipientId || undefined;
        
        if(!message) return NextResponse.json({ message: 'Message is empty' }, { status: 200 });

        if(!recipientId) {
            const admin = await User.find({ admin: true });
            recipientId = admin[0]._id.toString();
        } else if(!user?.admin) {
            const recipientIdObject = jwt.verify(recipientId, process.env.ACTION_KEY);
            recipientId = recipientIdObject?.recipientId;
        }

        await Message.create({ from: userId, to: recipientId, message });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}