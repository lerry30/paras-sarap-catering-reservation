import { NextResponse } from 'next/server';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';

// this get method returns link specifically for admin or client
// since avatar encompasses settings of user so it defines whether
// the user is admin or not
export const GET = async (request) => {
    try { 
        const isAnAdmin = await apiIsAnAdmin(request);
        const profilePath = isAnAdmin ? '/admin?display=profile' : '/profile';

        return NextResponse.json({ message: '', success: true, data: profilePath }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}
