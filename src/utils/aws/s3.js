import crypto from 'crypto';

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
        correctClockSkew: true,
    }
});

export const uploadFileToS3 = async (buffer, awsFolder=undefined) => {
    try {
        const filename = crypto.randomBytes(8).toString('hex');
        const path = !awsFolder ? filename : `${ awsFolder }/${filename}`;
        const parameters = {
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
            Key: path,
            Body: buffer,
            ContentType: 'image/jpg',
        };

        const command = new PutObjectCommand(parameters);
        await s3Client.send(command);

        const awsImgUrl = `${ process.env.AWS_IMG_URL }/${ path }`;
        return { uploaded: true, filename: awsImgUrl };
    } catch(error) {
        console.log(error);
        return { uploaded: false, filename: '' };
    }
}

export const deleteFileFromS3 = async (pathname) => {
    try {
        const parameters = {
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
            Key: pathname,
        };

        const command = new DeleteObjectCommand(parameters);
        await s3Client.send(command);
        return { deletion: true };
    } catch (error) {
        console.error(error);
        return { deletion: false };
    }
}