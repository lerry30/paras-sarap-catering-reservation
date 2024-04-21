import { NextResponse } from 'next/server';
import Reservation from '@/models/Reservation';

export const PUT = async (request) => {
    try {
        const form = await request.formData();
        const id = form.get('id')?.trim();
        const nStatus = form.get('status')?.trim();
        const statusVariants = { pending: true, accepted: true, denied: true };

        if(!id || !nStatus || !statusVariants[nStatus]) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });

        await Reservation.findByIdAndUpdate(id, { status: nStatus });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });
    }
}