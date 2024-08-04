import { NextResponse } from 'next/server';
import User from '@/models/Users';
import Dish from '@/models/Dishes';
import Drink from '@/models/Drinks';
import Venue from '@/models/Venues';

import Reservation from '@/models/Reservation';
import Rating from '@/models/Ratings';

const getStatusCountDifference = (reservations) => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let expired = 0;
    for(const reservation of reservations) {
        if(reservation?.status === 'pending') pending++;
        else if(reservation?.status === 'approved') approved++;
        else if(reservation?.status === 'rejected') rejected++;
        else if(reservation?.status === 'expired') expired++;
    }

    return { pending, approved, rejected, expired };
}

const getMonthsOfReservation = (reservations) => {
    const countMonths = Array(12).fill(0);
    for(const reservation of reservations) {
        // I added a condition since the date is originally comes from user
        const date = new Date(reservation?.date?.day);
        if(isNaN(date)) continue;
        const monthNo = date.getMonth();
        countMonths[monthNo] = countMonths[monthNo] + 1;
    }

    return countMonths;
}

const getMonthlyUserAccounts = (users) => {
    const userCount = Array(12).fill(0);
    for(const user of users) {
        // I'll not filter it too much since createdAt is auto generated
        const monthNo = new Date(user.createdAt).getMonth();
        userCount[monthNo] = userCount[monthNo] + 1; 
    }

    return userCount;
}

const extractVenuePopularity = (reservations, venues) => {
    const details = {};
    // initialized every venue
    for(const venue of venues) {
        const venueName = String(venue?.name).trim();
        details[venueName] = 0;
    }
    // count selected venue on every reservations
    for(const reservation of reservations) {
        const venueName = String(reservation?.venue?.name).trim();
        details[venueName] = details[venueName] + 1;
    }

    return details;
}

export const GET = async () => {
    try {
        const users = await User.find({ admin: false });
        const dishes = await Dish.find({ status: 'available' });
        const drinks = await Drink.find({ status: 'available' });
        const venues = await Venue.find({ status: 'available' });

        const reservations = await Reservation.find({});
        const ratings = await Rating.find({});

        const reservationStatusesCount = getStatusCountDifference(reservations) 
            || { pending: 0, approved: 0, rejected: 0, expired: 0 };
        const monthsOfReservation = getMonthsOfReservation(reservations);
        const monthlyUserAccount = getMonthlyUserAccounts(users);
        const venuePopularity = extractVenuePopularity(reservations, venues);

        const data = {
            // just get the number of user
            users: users?.length || 0, 
            dishes: dishes?.length || 0, 
            drinks: drinks?.length || 0,
            venues: venues?.length || 0,
            reservations: reservationStatusesCount,
            ratings: ratings.map(item => item?.point),
            months: monthsOfReservation,
            monthlyUserAccount: monthlyUserAccount,
            venuePopularity,
        };

        return NextResponse.json({ message: '', data }, { error: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { error: 400 });
    }
}
