import sharp from 'sharp';
import Venue from '@/models/Venues';
import TitleFormat from '@/utils/titleFormat';
import jwt from 'jsonwebtoken';
import { emptyVenueFields } from '@/utils/admin/emptyValidation';
import { NextResponse } from 'next/server';
import { uploadFileToS3, deleteFileFromS3 } from '@/utils/aws/s3';
import { apiIsAnAdmin } from '@/utils/auth/api/isanadmin';
import { toNumber } from '@/utils/number';
import { addressAll } from '@/utils/philAddress';

const imageQuality = toNumber(process.env.SHARP_IMG_QUALITY);

export const GET = async () => {
    try {
        const allVenues = (await Venue.find({}).sort({ createdAt: -1 })) || [];
        const data = [];
        for(const venue of allVenues) {
            const key = jwt.sign({ _id: venue._id }, process.env.ACTION_KEY);
            const item = {
                _k: key,
                name: venue?.name,
                description: venue?.description,
                address: venue?.address,
                filename: venue?.filename,
                maximumSeatingCapacity: venue?.maximumSeatingCapacity,
                price: venue?.price,
                chargesForTablesAndChairs: venue?.chargesForTablesAndChairs,
                status: venue?.status,
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
        const venueName = form.get('venuename')?.trim();
        const description = form.get('description')?.trim();
        const file = form.get('file');
        const price = toNumber(form.get('price'));
        const chargesForTablesAndChairs = toNumber(form.get('chargesForTablesAndChairs'));
        const maximumSeatingCapacity = toNumber(form.get('maximumSeatingCapacity'));
        const street = form.get('street')?.trim();
        const barangay = form.get('barangay')?.trim();
        const municipality = form.get('municipality')?.trim();
        const province = form.get('province')?.trim();
        const region = form.get('region')?.trim();

        const invalidFields = emptyVenueFields(venueName, description, file?.name, region, province, municipality, barangay, street); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(price === 0) invalidFields.price = 'Enter a numerical value greater than zero for the price.';
        if(maximumSeatingCapacity === 0) invalidFields.maximumSeatingCapacity = 'Enter a numerical value greater than zero for the maximum seating capacity.';
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
        
        const fVenueName = TitleFormat(venueName);
        const fDescription = `${ description[0]?.toUpperCase() }${ description.substring(1) }`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const isValidAddress = addressAll[region]?.province[province]?.municipality[municipality]?.barangay?.includes(barangay)

        const fStreet = TitleFormat(street);
        const fBarangay = TitleFormat(barangay);
        const fMunicipality = TitleFormat(municipality);
        const fProvince = TitleFormat(province);
        const fRegion = `${ region[0]?.toUpperCase() }${ region.substring(1) }`;

        if(!isValidAddress) return Response.json({ message: 'Invalid Address', errorData: 'unauth' }, { status: 400 });

        const venueFromDb = await Venue.findOne({ name: fVenueName });
        if(venueFromDb)
            return Response.json({ message: 'Venue already exist', errorData: 'venuename' }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
    
        const sharpImageData = await sharp(buffer).jpeg({ quality: imageQuality }).toBuffer(); // reduce file size
        const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'venues'); // upload into aws

        if(!uploaded) 
            return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });

        const venue = await Venue.create({ name: fVenueName, price, description: fDescription, address: { street: fStreet, barangay: fBarangay, municipality: fMunicipality, province: fProvince, region: fRegion }, filename, maximumSeatingCapacity, chargesForTablesAndChairs });
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

        const deletionResponse = await Venue.findByIdAndDelete(_id); // return deleted item
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
        const venueId = form.get('id')?.trim();
        const venueName = form.get('venuename')?.trim();
        const description = form.get('description')?.trim();
        const file = form.get('file');
        const price = toNumber(form.get('price'));
        const chargesForTablesAndChairs = toNumber(form.get('chargesForTablesAndChairs'));
        const maximumSeatingCapacity = toNumber(form.get('maximumSeatingCapacity'));
        const status = form.get('status')?.trim();
        const street = form.get('street')?.trim();
        const barangay = form.get('barangay')?.trim();
        const municipality = form.get('municipality')?.trim();
        const province = form.get('province')?.trim();
        const region = form.get('region')?.trim();

        const isImageChange = !!Number(form.get('is-image-change')); // it is actually a boolean but because form converts it to string, I'll need to convert it to number the boolean
        if(!venueId) return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });

        const invalidFields = emptyVenueFields(venueName, description, true, region, province, municipality, barangay, street); // file return File Object still - File { size: 0, type: 'application/octet-stream', name: '', lastModified: 1712386503245 }, so validating the name effectively work I guess
        if(price === 0) invalidFields.price = 'Enter a numerical value greater than zero for the price.';
        if(maximumSeatingCapacity === 0) invalidFields.maximumSeatingCapacity = 'Enter a numerical value greater than zero for the maximum seating capacity.';
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now

        const fVenueName = TitleFormat(venueName);
        const fDescription = (`${ description[0]?.toUpperCase() }${ description.substring(1) }`).trim();
        const statusValues = { available: 'available', unavailable: 'unavailable' };
        const fStatus = statusValues[status] || 'available';
        const isValidAddress = addressAll[region]?.province[province]?.municipality[municipality]?.barangay?.includes(barangay);

        const fStreet = TitleFormat(street);
        const fBarangay = TitleFormat(barangay);
        const fMunicipality = TitleFormat(municipality);
        const fProvince = TitleFormat(province);
        const fRegion = TitleFormat(region);

        if(!isValidAddress) return Response.json({ message: 'Invalid Address', errorData: 'unauth' }, { status: 400 });

        const venueIdDecoded = jwt.verify(venueId, process.env.ACTION_KEY);
        if(isImageChange) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const sharpImageData = await sharp(buffer).jpeg({ quality: imageQuality }).toBuffer(); // reduce file size
            const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'venues'); // upload into aws

            if(!uploaded) 
                return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });
            const prevVenue = await Venue.findByIdAndUpdate(venueIdDecoded, { filename }, { option: true });

            // delete previous file from aws
            const imageURL = new URL(prevVenue.filename);
            const pathname = imageURL.pathname.startsWith('/') ? imageURL.pathname.substring(1) : imageURL.pathname;
            await deleteFileFromS3(pathname);
        }

        const venue = await Venue.findByIdAndUpdate(venueIdDecoded, { name: fVenueName, price, description: fDescription, address: { street: fStreet, barangay: fBarangay, municipality: fMunicipality, province: fProvince, region: fRegion }, maximumSeatingCapacity, chargesForTablesAndChairs, status: fStatus });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong!', errorData: 'unauth' }, { status: 400 });
    }
}

// Issue: reducing image size multiple times cause of multiple update might be a bad idea
