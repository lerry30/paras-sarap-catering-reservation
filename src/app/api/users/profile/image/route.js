import { NextResponse } from 'next/server';
import { decodeUserIdFromHeader } from '@/utils/auth/decode';
import { uploadFileToS3, deleteFileFromS3 } from '@/utils/aws/s3';
import { toNumber } from '@/utils/number';
import sharp from 'sharp';
import User from '@/models/Users';

const imageQuality = toNumber(process.env.SHARP_IMG_QUALITY);

export const PUT = async (response) => {
    try {
        const form = await response?.formData();
        const file = form?.get('file')
        
        if(!file?.name)
            return Response.json({ message: 'There\'s something wrong', errorData: 'unauth' }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now

        const buffer = Buffer.from(await file.arrayBuffer());

        const userId = decodeUserIdFromHeader();
        const user = await User.findById(userId);
        if(!user)
            return Response.json({ message: 'There\'s something wrong.', errorData: 'unauth' }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now
    
        const currentProfileImage = user?.filename;
        if(currentProfileImage) {
            const imageURL = new URL(currentProfileImage);
            const pathname = imageURL.pathname.startsWith('/') ? imageURL.pathname.substring(1) : imageURL.pathname;
            await deleteFileFromS3(pathname);
        }

        const sharpImageData = await sharp(buffer).jpeg({ quality: imageQuality }).toBuffer(); // reduce file size
        const { uploaded, filename } = await uploadFileToS3(sharpImageData, 'profile'); // upload into aws

        if(!uploaded) 
            return NextResponse.json({ message: 'There\'s something wrong, uploading file to AWS!', errorData: 'unauth' }, { status: 400 });

        await User.findByIdAndUpdate(userId, { filename });
        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}
