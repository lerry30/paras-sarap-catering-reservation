import sharp from 'sharp';
import Drink from '@/models/Drinks';
import TitleFormat from '@/utils/titleFormat';
import jwt from 'jsonwebtoken';
import { emptyDrinkFields } from '@/utils/admin/emptyValidation';
import { NextResponse } from 'next/server';
import { uploadFileToS3, deleteFileFromS3 } from '@/utils/aws/s3';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { toNumber } from '@/utils/number';

export const GET = async () => {
    try {
        const allDrinks = (await Drink.find({}).sort({ createdAt: -1 })) || [];
        const data = [];
        for(const drink of allDrinks) {
            const key = jwt.sign({ _id: drink._id }, process.env.ACTION_KEY);
            const item = {
                _k: key,
                name: drink?.name,
                description: drink?.description,
                filename: drink?.filename,
                costperhead: drink?.costperhead,
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
        const drinkName = form.get('drinkname')?.trim();
        const description = form.get('description')?.trim();
        const file = form.get('file');
        const costPerHead = toNumber(form.get('costperhead'));

        const invalidFields = emptyDrinkFields(drinkName, description, file?.name); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(costPerHead === 0) invalidFields.costperhead = 'Enter a numerical value greater than zero for the cost per head';
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fDrinkName = TitleFormat(drinkName);
        const fDescription = (`${ description[0].toUpperCase() }${ description.substring(1) }`).trim();
        const buffer = Buffer.from(await file.arrayBuffer());

        const drinkFromDb = await Drink.findOne({ name: fDrinkName });
        if(drinkFromDb)
            return Response.json({ message: 'Drink already exist', errorData: 'drinkname' }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
    
        const sharpImageData = await sharp(buffer).jpeg({ quality: 30 }).toBuffer(); // reduce file size
        const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'drinks'); // upload into aws

        if(!uploaded) 
            return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });

        const drink = await Drink.create({ name: fDrinkName, description: fDescription, filename, costperhead: costPerHead });
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

        const deletionResponse = await Drink.findByIdAndDelete(_id); // return deleted item
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
        const drinkId = form.get('id')?.trim();
        const drinkName = form.get('drinkname')?.trim();
        const description = form.get('description')?.trim();
        const file = form.get('file');
        const costPerHead = toNumber(form.get('costperhead'));
        const isImageChange = !!Number(form.get('is-image-change')); // it is actually a boolean but because form converts it to string, I'll need to convert it to number the boolean

        if(!drinkId) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });

        const invalidFields = emptyDrinkFields(drinkName, description, true); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(costPerHead === 0) invalidFields.costperhead = 'Enter a numerical value greater than zero for the cost per head';
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fDrinkName = TitleFormat(drinkName);
        const fDescription = (`${ description[0].toUpperCase() }${ description.substring(1) }`).trim();
        
        const drinkIdDecoded = jwt.verify(drinkId, process.env.ACTION_KEY);
        if(isImageChange) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const sharpImageData = await sharp(buffer).jpeg({ quality: 10 }).toBuffer(); // reduce file size
            const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'drinks'); // upload into aws

            if(!uploaded) 
                return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });
            const prevDrink = await Drink.findByIdAndUpdate(drinkIdDecoded, { filename }, { option: true });

            // delete previous file from aws
            const imageURL = new URL(prevDrink.filename);
            const pathname = imageURL.pathname.startsWith('/') ? imageURL.pathname.substring(1) : imageURL.pathname;
            await deleteFileFromS3(pathname);
        }

        const drink = await Drink.findByIdAndUpdate(drinkIdDecoded, { name: fDrinkName, description: fDescription, costperhead: costPerHead });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}

// Issue: reducing image size multiple times cause of multiple update might be a bad idea