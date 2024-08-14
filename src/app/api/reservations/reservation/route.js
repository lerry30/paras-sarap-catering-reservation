import { NextResponse } from 'next/server';
import { decodeUserIdFromHeader } from '@/utils/auth/decode';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { toNumber } from '@/utils/number';
import Reservation from '@/models/Reservation';
import Rating from '@/models/Ratings';
import Policy from '@/models/Policies';
import jwt from 'jsonwebtoken';

// validate reservation date
const pastReservation = (date) => {
    const dateInMili = new Date(date).getTime();
    const today = new Date();
    const fToday = new Date(today) - (1000*60*60*24);
    return fToday > dateInMili;
}

// check if already rate the reservation
const isRated = (reservationId, ratings) => {
    for(const rateData of ratings)
        if(String(rateData?.reservationId) === String(reservationId)) return true
    return false;
}

// check if pending status is expired
const expiredReservation = async (date, status, daysOfPreparation, id) => {
    if(status === 'pending') {
        const computeDaysOfPreparation = toNumber(daysOfPreparation) * 1000 * 60 * 60 * 24;
        const expirationDate = new Date(Date.now()).getTime() + computeDaysOfPreparation;
        const reservationDate = new Date(date);
        if(expirationDate > reservationDate.getTime() || isNaN(reservationDate)) {
            await Reservation.findByIdAndUpdate(String(id), { status: 'expired' });
            return true;
        }
    }

    return false;
}

export const GET = async (request) => {
    try {
        const userId = decodeUserIdFromHeader();
        const reservations = (await Reservation.find({ userId }).sort({ createdAt: -1 })) || [];
        const isAnAdmin = await apiIsAnAdmin(request);
        const ratings = await Rating.find({ userId });
        const policies = await Policy.findOne({});
        const nReservations = [];
        for(let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i];
            // if(reservation?.status === 'expired' && !isAnAdmin) continue
            if(reservation?.status === 'expired') continue
            const isExpired = await expiredReservation(
                reservation.date.day, 
                reservation.status, 
                (policies?.noofpreparationdays || 3), 
                reservation._id
            );

            // if(!!isExpired && !!isAnAdmin) {
            //  reservation?.status = 'expired';
            //  continue;
            // }
            if(!!isExpired) continue;

            const reservationKey = jwt.sign({ reservationId: String(reservation._id) }, process.env.RESERVATION_KEY);

            const reservationData = {
                id: reservationKey,
                event: reservation.event,
                theme: reservation.theme,
                venue: reservation.venue,
                menu: reservation.menu,
                date: reservation.date,
                noofguest: reservation.noofguest,
                status: reservation.status,
                createdAt: reservation.createdAt,
            };

            if(!isAnAdmin && reservation.status === 'approved') {
                // service done to rate
                const toRate = pastReservation(reservation?.date?.day);
                reservationData['toRate'] = toRate;
                
                if(isRated(reservation._id, ratings)) continue;
            }

            nReservations.push(reservationData);
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
            // console.log(dateInMilli, Number(dateAsKey))
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
