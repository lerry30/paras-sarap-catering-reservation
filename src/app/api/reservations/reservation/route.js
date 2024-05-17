import { NextResponse } from 'next/server';
import { decodeUserIdFromHeader } from '@/utils/auth/decode';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import Reservation from '@/models/Reservation';

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
        const isAnAdmin = await apiIsAnAdmin(request);
        if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const form = await request.formData();
        const id = form.get('id')?.trim();
        const nStatus = form.get('status')?.trim();
        const statusVariants = { pending: true, approved: true, rejected: true };

        if(!id || !nStatus || !statusVariants.hasOwnProperty(nStatus)) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });

        await Reservation.findByIdAndUpdate(id, { status: nStatus });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });
    }
}

export const DELETE = async (request) => {
    try {
        const jsonRequest = await request?.json();
        const dateAsKey = jsonRequest.dateAsKey.toString().trim();

        if(!dateAsKey) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });

        const userId = decodeUserIdFromHeader();
        if(!userId) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });

        const reservations = await Reservation.find({ userId });

        for(const reservation of reservations) {
            if(reservation.status !== 'pending') continue;
            const reservationCreation = reservation.createdAt;

            const dateInMilli = new Date(reservationCreation).getTime();
            console.log(dateInMilli, Number(dateAsKey))
            if(dateInMilli === Number(dateAsKey)) {
                const reservationId = reservation._id;
                await Reservation.findByIdAndDelete(reservationId);
                return NextResponse.json({ message: '', success: true }, { status: 200 });
            }
        }

        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });
    }
}