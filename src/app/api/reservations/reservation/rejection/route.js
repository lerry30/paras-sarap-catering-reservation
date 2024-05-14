import { NextResponse } from 'next/server';
import { decodeUserIdFromHeader } from '@/utils/auth/decode';
import reservationRejectionReason from '@/models/ReservationRejectionReason';
import Reservation from '@/models/Reservation';

export const GET = async () => {
    try {
        const userId = decodeUserIdFromHeader();
        const reservations = (await Reservation.find({ userId }).sort({ createdAt: -1 })) || [];
        const reservationRejectionReasonData = [];
        for(let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i];
            const reservationId = reservation._id;

            const rejectionReasonData = await reservationRejectionReason.findOne({ reservationId });
            if(!rejectionReasonData) continue;
            const { reason } = rejectionReasonData;
            const { createdAt } = reservation;
            reservationRejectionReasonData.push({ reason, createdAt });
        }

        return NextResponse.json({ message: '', data: reservationRejectionReasonData }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}

export const POST = async (request) => {
    try {
        const form = await request.formData();
        const id = String(form.get('id'))?.trim();
        const reason = String(form.get('textbox'))?.trim();
        
        if(!id || !reason) return NextResponse.json({ message: 'Please fill in the input.' }, { status: 400 });
        if(reason.length > 200) return NextResponse.json({ message: 'Max 200 characters for reason, please be concise.' }, { status: 400 });

        await reservationRejectionReason.create({ reservationId: id, reason });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });
    }
}

export const DELETE = async (request) => {
    try {
        const jsonData = await request?.json();
        const id = String(jsonData?.id).trim();
        
        if(!id) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        await reservationRejectionReason.findOneAndDelete({ reservationId: id });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'error' }, { status: 400 });
    }
}