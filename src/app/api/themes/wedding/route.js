import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import TitleFormat from '@/utils/titleFormat';
import WeddingTheme from '@/models/WeddingThemes';

import { emptyThemeFields } from '@/utils/admin/emptyValidation';
import { NextResponse } from 'next/server';
import { uploadFileToS3, deleteFileFromS3 } from '@/utils/aws/s3';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { toNumber } from '@/utils/number';

const imageQuality = toNumber(process.env.SHARP_IMG_QUALITY);

export const GET = async () => {
    try {
        const weddingThemes = (await WeddingTheme.find({}).sort({ createdAt: -1 })) || [];
        const data = [];
        for(const theme of weddingThemes) {
            const key = jwt.sign({ _id: theme._id }, process.env.ACTION_KEY);
            const item = {
                _k: key,
                name: theme?.name,
                description: theme?.description,
                filename: theme?.filename,
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
        const themeName = String(form.get('themename'))?.trim();
        const description = String(form.get('description'))?.trim();
        const file = form.get('file');

        const invalidFields = emptyThemeFields(themeName, description, file?.name); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fThemeName = TitleFormat(themeName);
        const fDescription = (`${ description[0]?.toUpperCase() }${ description.substring(1) }`).trim();
        const buffer = Buffer.from(await file.arrayBuffer());

        const weddingThemeFromDb = await WeddingTheme.findOne({ name: fThemeName });
        if(weddingThemeFromDb)
            return Response.json({ message: 'Wedding Theme already exist', errorData: 'themename' }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
    
        const sharpImageData = await sharp(buffer).jpeg({ quality: imageQuality }).toBuffer(); // reduce file size
        const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'weddingthemes'); // upload into aws

        if(!uploaded) 
            return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });

        const weddingtheme = await WeddingTheme.create({ name: fThemeName, description: fDescription, filename });
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

        const deletionResponse = await WeddingTheme.findByIdAndDelete(_id); // return deleted item
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
        const themeId = form.get('id')?.trim();
        const themeName = form.get('themename')?.trim();
        const description = form.get('description')?.trim();
        const file = form.get('file');
        const isImageChange = !!Number(form.get('is-image-change')); // it is actually a boolean but because form converts it to string, I'll need to convert it to number the boolean

        if(!themeId) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });

        const invalidFields = emptyThemeFields(themeName, description, true); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fThemeName = TitleFormat(themeName);
        const fDescription = (`${ description[0]?.toUpperCase() }${ description.substring(1) }`).trim();
        
        const themeIdDecoded = jwt.verify(themeId, process.env.ACTION_KEY);
        if(isImageChange) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const sharpImageData = await sharp(buffer).jpeg({ quality: imageQuality }).toBuffer(); // reduce file size
            const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'drinks'); // upload into aws

            if(!uploaded) 
                return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });
            const prevTheme = await WeddingTheme.findByIdAndUpdate(themeIdDecoded, { filename }, { option: true });

            // delete previous file from aws
            const imageURL = new URL(prevTheme.filename);
            const pathname = imageURL.pathname.startsWith('/') ? imageURL.pathname.substring(1) : imageURL.pathname;
            await deleteFileFromS3(pathname);
        }

        const theme = await WeddingTheme.findByIdAndUpdate(themeIdDecoded, { name: fThemeName, description: fDescription });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}

// Issue: reducing image size multiple times cause of multiple update might be a bad idea
