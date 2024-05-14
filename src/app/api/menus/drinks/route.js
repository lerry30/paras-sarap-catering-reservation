import Drink from '@/models/Drinks';
import { NextResponse } from 'next/server';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';

export const GET = async (request) => {
    try {
        // const isAnAdmin = await apiIsAnAdmin(request);
        // if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const allDrinks = (await Drink.find({}).sort({ createdAt: -1 })) || [];
        return NextResponse.json({ message: '', data: allDrinks }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}