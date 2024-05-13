import { NextResponse } from 'next/server';
import reservationRejectionReason from '@/models/ReservationRejectionReason';

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