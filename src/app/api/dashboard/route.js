import { NextResponse } from 'next/server';
import User from '@/models/Users';
import Dish from '@/models/Dishes';
import Drink from '@/models/Drinks';
import Venue from '@/models/Venues';

export const GET = async () => {
    try {
        const userCount = await User.find({ admin: false });
        const dishCount = await Dish.find({ status: 'available' });
        const drinkCount = await Drink.find({ status: 'available' });
        const venueCount = await Venue.find({ status: 'available' });
        
        const data = {
            users: userCount?.length || 0,
            dishes: dishCount?.length || 0,
            drinks: drinkCount?.length || 0,
            venues: venueCount?.length || 0
        };

        return NextResponse.json({ message: '', data }, { error: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { error: 400 });
    }
}
