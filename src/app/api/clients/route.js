import User from '@/models/Users';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        const isAnAdmin = await apiIsAnAdmin(request);
        if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const users = await User.find({});
        const data = [];
        for(const user of users) {
            if(!user?.admin) {
                data.push(user);
            }
        }
        
        return NextResponse.json({ message: '', data }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}