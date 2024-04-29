import User from '@/models/Users';
// import jwt from 'jsonwebtoken';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    try {
        const isAnAdmin = await apiIsAnAdmin(request);
        if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const text = String(request.json()).trim();

        const users = await User.findOne({  });
        const data = [];
        for(const user of users) {
            if(!user?.admin) {
                const id = user?._id?.toString();
                const firstname = user?.firstname || '';
                const lastname = user?.lastname || '';
                const email = user?.email || '';
                const filename = user?.filename || '';
                const status = user?.status || 'active';
                const createdAt = user?.createdAt || '';

                // const eId = jwt.sign({ recipientId: id }, process.env.ACTION_KEY)
                data.push({ id, firstname, lastname, email, filename, status, createdAt });
            }
        }
        
        return NextResponse.json({ message: '', data }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}