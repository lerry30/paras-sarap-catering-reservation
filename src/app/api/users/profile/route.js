import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import User from '@/models/Users';

import { isDisposableEmail, isAnEmail } from '@/utils/auth/emailValidation';
import { isAValidPassword, missingRequirements } from '@/utils/auth/passwordValidation';
import { emptySignUpFields } from '@/utils/auth/emptyValidation';
import { toHash } from '@/utils/auth/crypt';

import { decodeUserIdFromHeader } from '@/utils/auth/decode';

export const PUT = async (request) => {
    try {
        const form = await request?.formData();
        const firstname = String(form?.get('firstname'))?.trim();
        const lastname = String(form?.get('lastname'))?.trim();
        const email = String(form?.get('new-email'))?.trim();
        const oldPassword = String(form?.get('old-password'))?.trim();
        const newPassword = String(form?.get('new-password'))?.trim();

        const invalidFields = emptySignUpFields(firstname, lastname, email, '_');
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now

        if(!isAnEmail(email)) 
            return NextResponse.json({ message: 'Invalid email address', errorData: 'email' }, { status: 501 });

        if(isDisposableEmail(email)) 
            return NextResponse.json({ message: 'Email is invalid. Try different one', errorData: 'email' }, { status: 501 });

        const userId = decodeUserIdFromHeader();
        const user = await User.findById(userId);

        if(!user) 
            return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });

        let hashPassword = user?.password || '';

        // only change the password if old password is provided otherwise skip this part
        if(oldPassword) {
            if(!isAValidPassword(oldPassword)) 
                return NextResponse.json({ message: `Wrong password.`, errorData: 'password' }, { status: 401 });
        
            const isVerified = await bcrypt.compare(oldPassword, hashPassword);

            if(!isVerified) 
                return NextResponse.json({ message: 'Wrong password', errorData: 'unauth' }, { status: 400 });

            if(!isAValidPassword(newPassword)) {
                const missing = missingRequirements(newPassword);
                return NextResponse.json({ message: `Invalid password. ${missing}`, errorData: 'password' }, { status: 401 });
            }

            hashPassword = await toHash(newPassword);
        }

        await User.findByIdAndUpdate(userId, { firstname, lastname, email, password: hashPassword });
        return NextResponse.json({ message: '', success: true }, { status: 201 });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong with your data.' }, { status: 400 });
    }
}
