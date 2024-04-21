import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { config, rateLimit } from 'x-rate-limiter';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '@/models/Users';

import { isDisposableEmail, isAnEmail } from '@/utils/auth/emailValidation';
import { isAValidPassword, missingRequirements } from '@/utils/auth/passwordValidation';
import { emptySignUpFields } from '@/utils/auth/emptyValidation';
import { toHash } from '@/utils/auth/crypt';

/**
 * generate token for rate limit and vercel blob, this will be stored in local storage
 * validate inputs
 *      check if empty
 *      check if the email is a temp mail
 *              I can't find any solution to actually detect if the mail is
 *                  a disposable so I made a simple list of invalid domain name
 *                  to prevent at least one of them from registering into my web
 *      check the email and password format
 * check if the user exist in the database
 */

export const GET = (request) => {
    const cookie = cookies();
    if(!cookie.has('user-signup-token')) {
        /*
            generate token for rate limit
        */
        const hex = crypto.randomBytes(16).toString('hex');
        const token = jwt.sign({ userSignUpKey: hex }, process.env.SIGNUP_USER_TOKEN_KEY);
        cookie.set('user-signup-token', token, { secure: true, maxAge: (1000 * 60 * 60 * 3), httpOnly: true });
    }

    return NextResponse.json({ message: '', }, { status: 201 });
}

config(2, { activeMaxRequest: 4, rest: ( 1000 * 60 * 10 ) }); // 6 requests allowed per 10 mins

// SIGN UP
export const POST = async (request) => {
    try {
        const signUpJsonData = await request.json();
        const { firstname, lastname, email, password } = signUpJsonData;

        const invalidFields = emptySignUpFields(firstname, lastname, email, password);
        if(Object.values(invalidFields).length > 0)
            return Response.json({ message: 'All fields should be filled', errorData: invalidFields }, { status: 400 }); // I turn 204 to 400 since nextjs have problem with responding with status code of 204 right now

        if(!isAnEmail(email)) 
            return NextResponse.json({ message: 'Invalid email address', errorData: 'email' }, { status: 501 });

        if(isDisposableEmail(email)) 
            return NextResponse.json({ message: 'Email is invalid. Try different one', errorData: 'email' }, { status: 501 });

        if(!isAValidPassword(password)) {
            const missing = missingRequirements(password);
            return NextResponse.json({ message: `Invalid password. ${missing}`, errorData: 'password' }, { status: 401 });
        }

        const cookie = cookies();
        /*
            rate limit section
        */
        const userSignUpToken = cookie.get('user-signup-token')?.value;
        if(!userSignUpToken) 
            return NextResponse.json({ message: 'There\'s something wrong. Please try again later.', errorData: 'unauth' }, { status: 400 });
        /*
            get token for rate limit
        */
        const userIdKey = jwt.verify(userSignUpToken, process.env.SIGNUP_USER_TOKEN_KEY);
        /*
            rate limit so I need to refuse too much request from a single user(brute force attack)
        */
        const rateLimitMessage = rateLimit(userIdKey.userSignUpKey);

        if(rateLimitMessage.message)
            return NextResponse.json({ message: rateLimitMessage.message, errorData: 'unauth' }, { status: 400 });

        /*
            check if the user exist in the database
            since I'm not connected to database I'll skip this part
        */
        const userFromDb = await User.findOne({ email });
        if(userFromDb)          // User already exist.
            return NextResponse.json({ message: 'Invalid credentials.', errorData: 'unauth' }, { status: 401 });

        const hashPassword = await toHash(password);

        // save into database
        const user = await User.create({ firstname, lastname, email, password: hashPassword });

        /*
            token for signin that will save in cookies,
            so user doen't need to put his/her credential
        */
        const userTokenKey = crypto.randomBytes(16).toString('hex');
        const signInCredentialKey = `${ process.env.SIGNIN_USER_TOKEN_KEY }-${ userTokenKey }`;
        const encodedKey = jwt.sign({ userTokenKey }, process.env.SIGNIN_USER_TOKEN_KEY);
        const encodedData = jwt.sign({ userId: user._id }, signInCredentialKey);
        cookie.set('user-json-token-key', encodedKey, { secure: true, maxAge: (1000 * 60 * 60 * 24 * 7), httpOnly: true });
        cookie.set('user-json-token-data', encodedData, { secure: true, maxAge: (1000 * 60 * 60 * 24 * 7), httpOnly: true });

        return NextResponse.json({ message: '', success: true }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'There\'s something wrong with your data.', errorData: 'unauth' }, { status: 400 });
    }
}

export const DELETE = () => {
    const cookie = cookies();
    cookie.delete('user-signup-token');
    cookie.delete('user-signup-data-token');

    return NextResponse.json({ message: 'Sign up completed' }, { status: 200 });
}