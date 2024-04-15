import Menu from '@/models/Menus';
import Dish from '@/models/Dishes';
import Drink from '@/models/Drinks';
import TitleFormat from '@/utils/titleFormat';
import jwt from 'jsonwebtoken';
import { emptyMenuFields } from '@/utils/admin/emptyValidation';
import { NextResponse } from 'next/server';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';

export const GET = async () => {
    try {
        const allMenus = (await Menu.find({}).sort({ createdAt: -1 })) || [];
        const data = [];
        for(const menu of allMenus) {
            const key = jwt.sign({ _id: menu._id }, process.env.ACTION_KEY);
            const dishes = {};
            const drinks = {};

            for(const dishId of (menu?.dishes || [])) {
                const dish = (await Dish.findById(dishId) || {});
                dishes[dishId] = dish;
            }

            for(const drinkId of (menu?.drinks || [])) {
                const drink = (await Drink.findById(drinkId) || {});
                drinks[drinkId] = drink;
            }
            
            const item = {
                _k: key,
                name: menu?.name,
                description: menu?.description,
                status: menu?.status,
                dishes,
                drinks,
            };

            data.push(item);
        }

        return NextResponse.json({ message: '', data }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}

export const POST = async (request) => {
    try {
        const isAnAdmin = await apiIsAnAdmin(request);
        if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const form = await request.formData();
        const menuName = form.get('menuname')?.trim();
        const description = form.get('description')?.trim();
        const dishes = form.get('dishes')?.split(',');
        const drinks = form.get('drinks')?.split(',');

        const invalidFields = emptyMenuFields(menuName, description, dishes, drinks);
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fMenuName = TitleFormat(menuName);
        const fDescription = (`${ description[0].toUpperCase() }${ description.substring(1) }`).trim();

        const menuFromDb = await Menu.findOne({ name: fMenuName });
        if(menuFromDb)
            return Response.json({ message: 'Menu already exist', errorData: 'menuname' }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now

        const menu = await Menu.create({ name: fMenuName, description: fDescription, dishes, drinks });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}

export const DELETE = async (request) => {
    try {
        const isAnAdmin = await apiIsAnAdmin(request);
        if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const { _k } = await request.json();
        if(!_k) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
        
        const _id = jwt.verify(_k, process.env.ACTION_KEY);
        if(!_id) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        await Menu.findByIdAndDelete(_id); // return deleted item
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });
    }
}

export const PUT = async (request) => {
    try {
        const isAnAdmin = await apiIsAnAdmin(request);
        if(!isAnAdmin) return NextResponse.json({ message: 'There\'s something wrong!' }, { status: 400 });

        const form = await request.formData();
        const menuId = form.get('id').trim();
        const menuName = form.get('menuname')?.trim();
        const description = form.get('description')?.trim();
        const dishes = form.get('dishes')?.split(',');
        const drinks = form.get('drinks')?.split(',');
        const status = form.get('status')?.trim();
        
        if(!menuId) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });

        const invalidFields = emptyMenuFields(menuName, description, dishes, drinks);
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fMenuName = TitleFormat(menuName);
        const fDescription = (`${ description[0].toUpperCase() }${ description.substring(1) }`).trim();
        const statusValues = { available: 'available', unavailable: 'unavailable' };
        const fStatus = statusValues[status] || 'available';

        const menuIdDecoded = jwt.verify(menuId, process.env.ACTION_KEY);
        const drink = await Menu.findByIdAndUpdate(menuIdDecoded,  { name: fMenuName, description: fDescription, dishes, drinks, status: fStatus });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}