import { NextResponse } from 'next/server';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import Message from '@/models/Message';
import Reservation from '@/models/Reservation';
import Rating from '@/models/Ratings';

import { decodeUserIdFromHeader } from '@/utils/auth/decode';

// check if already rate the reservation
const isRated = (reservationId, ratings) => {
    for(const rateData of ratings)
        if(String(rateData?.reservationId) === String(reservationId)) return true
    return false;
}

export const GET = async (request) => {
    try { 
        const userId = decodeUserIdFromHeader();
        const isAnAdmin = await apiIsAnAdmin(request);

        const messages = await Message.find({ to: userId, viewed: false });
        const reservationFiltered = isAnAdmin ? { status: 'pending' } : { $or:[ {status: 'approved'}, {status: 'rejected'} ] };
        const reservations = await Reservation.find(reservationFiltered);
        const ratings = await Rating.find({ userId });
        
        let reservationCount = reservations.length;
        if(!isAnAdmin) {
            for(const index in reservations) {
                const reservation = reservations[index];
                if(isRated(reservation._id, ratings)) delete reservations[index];
            }

            reservationCount = separateStatuses(reservations);
        }

        const data = {
            messageCount: messages.length,
            reservationCount,
        };

        return NextResponse.json({ message: '', data: data }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}

function separateStatuses(data) {
    let approved = 0;
    let rejected = 0;

    for(const reservation of data) {
        if(reservation?.status === 'approved')
            approved++;
        else if(reservation?.status === 'rejected')
            rejected++;
    }

    return { approved, rejected };
}
