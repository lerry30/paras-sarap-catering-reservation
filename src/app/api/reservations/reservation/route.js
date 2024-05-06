import { NextResponse } from 'next/server';
import Reservation from '@/models/Reservation';
import { decodeUserIdFromHeader } from '@/utils/auth/decode';

export const GET = async (request) => {
    try {
        const userId = decodeUserIdFromHeader();
        const reservations = (await Reservation.find({ userId }).sort({ createdAt: -1 })) || [];
        const nReservations = [];
        for(let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i];

            nReservations.push({
                event: reservation.event,
                venue: reservation.venue,
                menu: reservation.menu,
                date: reservation.date,
                noofguest: reservation.noofguest,
                status: reservation.status,
                createdAt: reservation.createdAt,
            });
        }

        return NextResponse.json({ message: '', data: nReservations }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}

export const PUT = async (request) => {
    try {
        const form = await request.formData();
        const id = form.get('id')?.trim();
        const nStatus = form.get('status')?.trim();
        const statusVariants = { pending: true, approved: true, rejected: true };

        if(!id || !nStatus || !statusVariants[nStatus]) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });

        await Reservation.findByIdAndUpdate(id, { status: nStatus });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });
    }
}