import User from '@/models/Users';
const { decodeUserIdFromHeader } = require('@/utils/auth/decode')
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const userId = decodeUserIdFromHeader();
        const user = await User.findById(userId);

        if(!user)
            return NextResponse.json({ message: 'There\'s something wrong with your data.', errorData: 'unauth' }, { status: 400 });
        
        const userData = { 
            firstname: user?.firstname || '', 
            lastname: user?.lastname || '', 
            email: user?.email || ''
        };

        return NextResponse.json({ message: '', data: userData }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong with your data.', errorData: 'unauth' }, { status: 400 });
    }
}