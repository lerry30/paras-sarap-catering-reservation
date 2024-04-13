import User from '@/models/Users';
const { decodeUserIdFromHeader } = require('@/utils/auth/decode')
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const userId = decodeUserIdFromHeader();
        const state = await User.findById(userId);
        const user = state || {}
        
        const userData = { 
            firstname: user?.firstname || '', 
            lastname: user?.lastname || '', 
            email: user?.email || ''
        };
        
        if(!state)
            return NextResponse.json({ message: 'There\'s something wrong with your data.', data: userData, errorData: 'unauth' }, { status: 400 });
        
        return NextResponse.json({ message: '', data: userData }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong with your data.', errorData: 'unauth' }, { status: 400 });
    }
}