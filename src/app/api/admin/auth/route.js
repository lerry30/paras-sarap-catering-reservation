import { NextResponse } from 'next/server';
import { decodeUserIdFromRequest } from '@/utils/auth/decode';
import User from '@/models/Users';

export const POST = async (request) => {
    try {
        const { encodedKey, encodedData } = await request?.json();
        if(!encodedKey || !encodedData) NextResponse.json({ message: 'Encoded key & data are missing'}, { status: 401});
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);

        const user = await User.findById(userId);
        if(!user)  return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 401 });

        const isAnAdmin = !!user?.admin;
        return NextResponse.json({ message: '', isAnAdmin }, { status: 200 });
    } catch(error) {
        console.log('Admin Route Error', error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}