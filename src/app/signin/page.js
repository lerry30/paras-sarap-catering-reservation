'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendJSON, getData } from '@/utils/send';

import Link from 'next/link';
import ErrorField from '@/components/ErrorField';
import Loading from '@/components/Loading';
 
const SignInPage = () => {
    const [ emailAddress, setEmailAddress ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();

    const createUserDataKey = async () => {
        await getData('/api/users/signin');
    }

    // start the sign In process.
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setInvalidFieldsValue({});
        setLoading(true);
    
        try {
            await createUserDataKey();

            const signInResponse = await sendJSON('/api/users/signin', { email: emailAddress, password });
            if(signInResponse?.success) {
                await fetch('/api/users/signin', { method: 'DELETE' });
                const redirectTo = signInResponse?.sudosu ? '/admin' : '/services';
                router.push(redirectTo);
                return;
            } else {
                setInvalidFieldsValue(prev => ({ ...prev, unauth: 'There\'s something wrong. Please try again later.' }));
            }
        } catch (error) {
            // console.error('error', error.errors[0].longMessage)
            // const { message } = error.errors[0];
            setInvalidFieldsValue({ unauth: error.message });
        }

        // for some reason redirecting to home page
        // takes quite a bit of time, I set a timeout
        setTimeout(setLoading(false), 2000);
    };

    const start = async () => {
        // is signed in
        const signInStatus = await getData('/api/users/signed');
        if(signInStatus.signedIn) {
            router.push('/');
        } else {
            // if not
            createUserDataKey();
        }
    }

    useEffect(() => {
        start();
    }, []);
    
    return (
        <div className="-mt-[var(--nav-height)] card w-96 shadow-lg border-[1px] border-neutral-600">
            { loading && <Loading customStyle="w-full min-h-screen" /> }
            <form className="flex flex-col gap-2">
                <h3 className="font-headings text-center font-extrabold text-3xl">Sign In</h3>
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="input w-full border-[1px] border-neutral-600/60"
                        id="email" 
                        name="email" 
                        type="email" 
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="input w-full border-[1px] border-neutral-600/60"
                        id="password" 
                        name="password" 
                        type="password" 
                    />
                </div>
                <button 
                    type="submit"
                    onClick={handleSubmit}
                    className="button w-full mt-2 text-sm text-white bg-teal-500"
                >
                    SIGN IN
                </button>

                <ErrorField message={ invalidFieldsValue?.unauth } />

                <small className="text-center">
                    <span>Don't have an account?</span>
                    <Link 
                        href="/signup"
                        className="ml-2 bg-emerald-700/30 px-2 rounded-full"
                    >
                        Sign up
                    </Link>
                </small>
            </form>
        </div>
    );
}

export default SignInPage;