import { NextResponse } from 'next/server';
import { toNumber } from '@/utils/number';
import { decodeUserIdFromHeader } from '@/utils/auth/decode';
import Rating from '@/models/Ratings';
import jwt from 'jsonwebtoken';

export const GET = () => {

}

export const POST = async (response) => {
    try {
        const form = await response.formData();
        const id = String(form.get('id'));
        const point = toNumber(form.get('point-rating'));
        const message = String(form.get('textbox'));

        const userId = decodeUserIdFromHeader();
        if(!id) return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
        if(point <= 0) return NextResponse.json({ message: 'Please provide a valid rating by clicking a star from 1 to 5.' }, { status: 400 });

        const reservationId = jwt.verify(id, process.env.RESERVATION_KEY)?.reservationId;
        if(!reservationId) return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });

        await Rating.create({ userId, reservationId, point, message });
        
        return NextResponse.json({ messge: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}
