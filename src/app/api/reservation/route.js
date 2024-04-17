import Reservation from '@/models/Reservation';
import { decodeUserIdFromRequest } from '@/utils/auth/decode';
import { toNumber } from '@/utils/number';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    try {
        const jsonRequest = await request.json();
        const venue = jsonRequest?.venue;
        const menu = jsonRequest?.menu;
        const date = jsonRequest?.date;
        const noOfGuest = toNumber(jsonRequest?.noOfGuest);

        const encodedKey = request.cookies.get('user-json-token-key')?.value || '';
        const encodedData = request.cookies.get('user-json-token-data')?.value || '';

        if(!encodedKey || !encodedData) return false;
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);

        const data = {
            userId: userId,
            venue: {
                name: venue?.name,
                description: venue?.description,
                address: {
                    street: venue?.address?.street,
                    barangay: venue?.address?.barangay,
                    municipality: venue?.address?.municipality,
                    province: venue?.address?.province,
                    region: venue?.address?.region,
                },
                filename: venue?.filename,
                maximumSeatingCapacity: venue?.maximumSeatingCapacity,
                price: venue?.price,
            },
            menu: {
                name: menu?.name,
                description: menu?.description,
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