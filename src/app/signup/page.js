'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ErrorField from '@/components/ErrorField';
import Loading from '@/components/Loading';
import { sendJSON, getData } from '@/utils/send';
import { emptySignUpFields } from '@/utils/auth/emptyValidation';
import { handleError } from '@/utils/auth/backendError';

/**
 * a bit of validation in client, then in server
 * check if the user is existing in database
 * send a confirmation code
 */
 
const SignUpPage = () => {
    const [ name, setName ] = useState({ firstname: '', lastname: '' });
    const [ emailAddress, setEmailAddress ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const router = useRouter();

    const createUserDataKey = async () => {
        await getData('/api/users');
    }

    // start the sign up process.
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setInvalidFieldsValue({});
        setLoading(true);

        const invalidFields = emptySignUpFields(name.firstname, name.lastname, emailAddress, password);
        for(const [ field, message ] of Object.entries(invalidFields)) {
            setInvalidFieldsValue(prev => ({ ...prev, [field]: message }));
        }

        if(Object.values(invalidFields).length === 0) {
            try {
                await createUserDataKey();

                await sendJSON(
                    '/api/users/',
                    { 
                        firstname: name.firstname,
                        lastname: name.lastname,
                        email: emailAddress,
                        password,
                    }
                );

                fetch('/api/users', { method: 'DELETE' });
                router.push('/');
                return;
            } catch (error) {
                console.log(error); // development
                const backendErrors = handleError(error);
                setInvalidFieldsValue(prev => ({ ...prev, ...backendErrors }));
            }
        }

        setLoading(false);
    };

    // for firstname and lastname
    const naming = (ev) => {
        const inputElem = ev.target;
        setName({
            ...name,
            [inputElem.name]: inputElem.value
        });
    }

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
            <form>
                <h3 className="font-headings text-center font-extrabold text-3xl">Sign Up</h3>
                <div className="flex flex-col md:flex-row md:gap-2">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="firstname">First Name</label>
                        <input 
                            onChange={naming} 
                            className="input w-full border-[1px] border-neutral-600/60"
                            id="firstname" 
                            name="firstname" 
                            type="text" 
                        />
                        <ErrorField message={ invalidFieldsValue['firstname'] }/>
                    </div>
                    <div className="w-full md:w-1/2">
                        <label htmlFor="lastname">Last Name</label>
                        <input 
                            onChange={naming} 
                            className="input w-full border-[1px] border-neutral-600/60"
                            id="lastname" 
                            name="lastname" 
                            type="text" 
                        />
                        <ErrorField message={ invalidFieldsValue['lastname'] }/>
                    </div>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        onChange={(e) => setEmailAddress(e.target.value)} 
                        className="input w-full border-[1px] border-neutral-600/60"
                        id="email" 
                        name="email" 
                        type="email" 
                    />
                    <ErrorField message={ invalidFieldsValue['email'] }/>
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
                    <ErrorField message={ invalidFieldsValue['password'] }/>
                </div>
                <button 
                    type="submit"
                    onClick={handleSubmit}
                    className="button w-full mt-2 text-sm text-white bg-teal-500"
                >
                    SIGN UP
                </button>

                <ErrorField message={ invalidFieldsValue?.unauth }/>
                
                <small className="text-center">
                    <span>Already have an account?</span>
                    <Link 
                        href="/signin"
                        className="ml-2 bg-emerald-700/30 px-2 rounded-full"
                    >
                        Sign in
                    </Link>
                </small>
            </form>
        </div>
    );
}

export default SignUpPage;