import sharp from 'sharp';
import Dish from '@/models/Dishes';
import TitleFormat from '@/utils/titleFormat';
import jwt from 'jsonwebtoken';
import { emptyDishFields } from '@/utils/dishes/emptyValidation';
import { NextResponse } from 'next/server';
import { uploadFileToS3, deleteFileFromS3 } from '@/utils/aws/s3';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { toNumber } from '@/utils/number';

export const GET = async () => {
    try {
        const allDishes = (await Dish.find({}).sort({ createdAt: -1 })) || [];
        const data = [];
        for(const dish of allDishes) {
            const key = jwt.sign({ _id: dish._id }, process.env.ACTION_KEY);
            const item = {
                _k: key,
                name: dish?.name,
                description: dish?.description,
                allergens: dish?.allergens,
                filename: dish?.filename,
                costperhead: dish?.costperhead,
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
        const dishName = form.get('dishname');
        const description = form.get('description');
        const file = form.get('file');
        const costPerHead = toNumber(form.get('costperhead'));

        const containedAllergens = typeof form.get('allergens') === 'string' ? form.get('allergens').split(',') : [];
        const checkboxAllergens = [ 'nuts', 'seafood', 'milk', 'eggs', 'soybeans', 'grains' ];
        const removedDuplicates = [ ...new Set(containedAllergens) ];
        const verifiedValuesOfAllergens = removedDuplicates.filter(item => checkboxAllergens.includes(item)); // just to check since user can modify the value of checkbox in devtool so to make it safe, comparing it to ligitamate values is a must

        const invalidFields = emptyDishFields(dishName, description, file?.name); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(costPerHead === 0) invalidFields.costperhead = 'Enter a numerical value greater than zero for the cost per head';
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fDishName = TitleFormat(dishName);
        const fDescription = (`${ description[0].toUpperCase() }${ description.substring(1) }`).trim();
        const buffer = Buffer.from(await file.arrayBuffer());

        const dishFromDb = await Dish.findOne({ name: fDishName });
        if(dishFromDb)
            return Response.json({ message: 'Dish already exist', errorData: 'dishname' }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
    
        const sharpImageData = await sharp(buffer).jpeg({ quality: 30 }).toBuffer(); // reduce file size
        const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'dishes'); // upload into aws

        if(!uploaded) 
            return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });

        const dish = await Dish.create({ name: fDishName, description: fDescription, allergens: verifiedValuesOfAllergens, filename, costperhead: costPerHead });
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

        const deletionResponse = await Dish.findByIdAndDelete(_id); // return deleted item
        if(Object.values(deletionResponse).length > 0) {
            const imageURL = new URL(deletionResponse.filename);
            const pathname = imageURL.pathname.startsWith('/') ? imageURL.pathname.substring(1) : imageURL.pathname;
            await deleteFileFromS3(pathname);
        }

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
        const dishName = form.get('dishname');
        const description = form.get('description');
        const file = form.get('file');
        const costPerHead = toNumber(form.get('costperhead'));

        const containedAllergens = typeof form.get('allergens') === 'string' ? form.get('allergens').split(',') : [];
        const checkboxAllergens = [ 'nuts', 'seafood', 'milk', 'eggs', 'soybeans', 'grains' ];
        const removedDuplicates = [ ...new Set(containedAllergens) ];
        const verifiedValuesOfAllergens = removedDuplicates.filter(item => checkboxAllergens.includes(item)); // just to check since user can modify the value of checkbox in devtool so to make it safe, comparing it to ligitamate values is a must

        const invalidFields = emptyDishFields(dishName, description, file?.name); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(costPerHead === 0) invalidFields.costperhead = 'Enter a numerical value greater than zero for the cost per head';
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fDishName = TitleFormat(dishName);
        const fDescription = (`${ description[0].toUpperCase() }${ description.substring(1) }`).trim();
        const buffer = Buffer.from(await file.arrayBuffer());
   
        const sharpImageData = await sharp(buffer).jpeg({ quality: 30 }).toBuffer(); // reduce file size
        const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'dishes'); // upload into aws

        if(!uploaded) 
            return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });

        // const dish = await Dish.create({ name: fDishName, description: fDescription, allergens: verifiedValuesOfAllergens, filename, costperhead: costPerHead });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}

// Fix later
// Issue: reducing image size multiple times cause of multiple update might be a bad idea