import TitleFormat from '@/utils/titleFormat';
import Reservation from '@/models/Reservation';
import User from '@/models/Users';
import { decodeUserIdFromRequest } from '@/utils/auth/decode';
import { toNumber } from '@/utils/number';
import { addressAll } from '@/utils/philAddress';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        const reservations = (await Reservation.find({}).sort({ createdAt: -1 })) || [];
        const nReservations = [];
        for(let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i];
            const userId = reservation.userId;
            const user = await User.findById(userId);
            const userData = {
                firstname: user?.firstname,
                lastname: user?.lastname,
                email: user?.email,
                filename: user?.filename,
                status: user?.status,
            };

            nReservations.push({ 
                _id: reservation._id?.toString(), 
                event: reservation.event,
                venue: reservation.venue,
                menu: reservation.menu,
                date: reservation.date,
                user: userData,
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

export const POST = async (request) => {
    try {
        const jsonRequest = await request.json();
        const event = String(jsonRequest?.event).toLowerCase().trim();
        const venue = jsonRequest?.venue;
        const menu = jsonRequest?.menu;
        const date = jsonRequest?.date;
        const noOfGuest = toNumber(jsonRequest?.noofguest);
        
        // venue
        const street = venue?.address?.street?.trim();
        const barangay = venue?.address?.barangay?.trim().toUpperCase();
        const municipality = venue?.address?.municipality?.trim().toUpperCase();
        const province = venue?.address?.province?.trim().toUpperCase();
        const region = venue?.address?.region?.trim().toUpperCase();

        const isValidAddress = addressAll[region]?.province[province]?.municipality[municipality]?.barangay?.includes(barangay);
        if(!isValidAddress) return Response.json({ message: 'Invalid Address', errorData: 'error' }, { status: 400 });

        const fStreet = TitleFormat(street);
        const fBarangay = TitleFormat(barangay);
        const fMunicipality = TitleFormat(municipality);
        const fProvince = TitleFormat(province);
        const fRegion = TitleFormat(region);
        
        console.log(date);

        // get user id
        const encodedKey = request.cookies.get('user-json-token-key')?.value || '';
        const encodedData = request.cookies.get('user-json-token-data')?.value || '';
        if(!encodedKey || !encodedData) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);

        if(!userId) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const data = {
            userId: userId,
            event,
            venue: {
                name: venue?.name || '',
                description: venue?.description || '',
                address: {
                    street: fStreet,
                    barangay: fBarangay,
                    municipality: fMunicipality,
                    province: fProvince,
                    region: fRegion,
                },
                filename: venue?.filename || '',
                maximumSeatingCapacity: venue?.maximumSeatingCapacity || 0,
                price: venue?.price || 0,
            },
            menu: {
                name: menu?.name || '',
                description: menu?.description || '',
                listofdishes: menu?.listofdishes,
                listofdrinks: menu?.listofdrinks,
            },
            date: date,
            noofguest: noOfGuest, 
        };

        await Reservation.create(data);
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}
