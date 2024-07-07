'use client';

import CNavbar from '@/components/client/nav/CNavbar';
import FixMiniNavBar from '@/components/client/nav/FixMiniNavBar'; 
import Footer from '@/components/Footer';

import { CircleUserRound, Eye, EyeOff } from '@/components/icons/All';
import { zUserData } from '@/stores/user';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import ErrorField from '@/components/ErrorField';
import Loading from '@/components/Loading';
import TitleFormat from '@/utils/titleFormat';
import UploadButton from '@/components/UploadButton';

import { sendFormUpdate } from '@/utils/send';
import { emptySignUpFields } from '@/utils/auth/emptyValidation';
import { handleError } from '@/utils/auth/backendError';
import { user as localStorageName } from '@/utils/localStorageNames';

const Profile = () => {
    const [ name, setName ] = useState({ firstname: '', lastname: '' });
    const [ emailAddress, setEmailAddress ] = useState('');
    const [ profileImage, setProfileImage ] = useState('');
    const [ oldPassword, setOldPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');

    const [ file, setFile ] = useState(undefined);

    const [ togglePasswordDisplay, setTogglePasswordDisplay ] = useState({ old: false, new: false });
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState('');
    const [ loading, setLoading ] = useState(true);

    const [ editMode, setEditMode ] = useState(false);

    const resetUserStore = async () => { 
        localStorage.removeItem(localStorageName);
        await zUserData.getState().saveUserData();
    }

    // start the sign up process.
    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setInvalidFieldsValue({});
        setLoading(true);

        const invalidFields = emptySignUpFields(name.firstname, name.lastname, emailAddress, '_');
        setInvalidFieldsValue(prev => ({ ...prev, ...invalidFields}));

        if(Object.values(invalidFields).length === 0) {
            try {
                const form = new FormData(ev.target); 
                const response = await sendFormUpdate('/api/users/profile', form);

                if(response?.success)
                    await resetUserStore();
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

    const updateImage = async () => { 
        try {
            if(!file) return;
            const form = new FormData();
            form.append('file', file);
            await sendFormUpdate('/api/users/profile/image', form);
            await resetUserStore();
        } catch(error) {
            console.log(error); // development
        }        
    }

    const userSvg = () => <CircleUserRound strokeWidth={1} className="size-full" />

    useEffect(() => {
        zUserData.getState()?.saveUserData();
    }, []);

    useEffect(() => {
        if(Object.values(zUserData.getState()).length === 0) return;

        const firstname = TitleFormat(zUserData.getState()?.firstname);
        const lastname = TitleFormat(zUserData.getState()?.lastname);
        const email = zUserData.getState()?.email;
        const profileImg = zUserData.getState()?.filename;

        setName({ firstname, lastname});
        setEmailAddress(email);
        setProfileImage(profileImg);

        setLoading(false);
    }, [ zUserData.getState()?.filename ]);

    useEffect(() => {
        updateImage();
    }, [ file ]);

    if(loading) return <Loading customStyle="w-full min-h-screen"/>
            
    return (
        <div className="pt-[var(--nav-height)]">
            <CNavbar />
            <main className="w-full pt-20 px-4 md:px-36 lg:px-56 flex">
                <section className="size-full flex flex-col gap-6 lg:h-[calc(100vh-var(--nav-height))] md:flex-row">
                    <div className="size-full md:size-96 flex justify-center">
                        <UploadButton fileData={ [ file, setFile ]} DisplaySvg={ userSvg } className="!size-64 border-none !rounded-full overflow-hidden left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0" initialImageSrc={ profileImage } />
                    </div>
                    <div className="grow">                     
                        <form onSubmit={ handleSubmit } className="size-full px-2 flex flex-col gap-4">
                            <h3 className="font-headings font-extrabold text-3xl">Profile</h3>
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="w-full md:w-1/2">
                                    <label htmlFor="firstname">First Name</label>
                                    <input
                                        value={ name?.firstname }
                                        onChange={naming} 
                                        className={ `input w-full border-[1px] border-neutral-600/60 ${ !editMode && 'opacity-70' }` }
                                        id="firstname" 
                                        name="firstname" 
                                        type="text"
                                        required
                                        { ...{ disabled: !editMode } }
                                    />
                                    <ErrorField message={ invalidFieldsValue['firstname'] }/>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input 
                                        value={ name?.lastname }
                                        onChange={naming} 
                                        className={ `input w-full border-[1px] border-neutral-600/60 ${ !editMode && 'opacity-70' }` }
                                        id="lastname" 
                                        name="lastname" 
                                        type="text"
                                        required
                                        { ...{ disabled: !editMode } }
                                    />
                                    <ErrorField message={ invalidFieldsValue['lastname'] }/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input 
                                    value={ emailAddress }
                                    onChange={(e) => setEmailAddress(e.target.value)} 
                                    className={ `input w-full border-[1px] border-neutral-600/60 ${ !editMode && 'opacity-70' }` }
                                    id="email" 
                                    name="new-email"
                                    type="email"
                                    autoComplete="new-email"
                                    required
                                    { ...{ disabled: !editMode } }
                                />
                                <ErrorField message={ invalidFieldsValue['email'] }/>
                            </div>
                            {
                                editMode ?
                                    <>
                                        <div>
                                            <label htmlFor="old-password">Old Password</label>
                                            <div className="w-full flex rounded border-[1px] border-neutral-600/60">
                                                <input 
                                                    onChange={(e) => setOldPassword(e.target.value)} 
                                                    className="grow input"
                                                    id="old-password" 
                                                    name="old-password"
                                                    type={ togglePasswordDisplay?.old ? 'text': 'password' }
                                                />
                                                <button onClick={ ev => {
                                                    ev.preventDefault();
                                                    setTogglePasswordDisplay(state => ({ ...state, old: !state?.old }));
                                                 } } className="px-2" tabIndex="-1">
                                                    { togglePasswordDisplay?.old ? <Eye /> : <EyeOff /> }
                                                </button>
                                            </div>
                                            <ErrorField message={ invalidFieldsValue['password'] }/>
                                        </div>
                                        <div>
                                            <label htmlFor="new-password">New Password</label>
                                            <div className="w-full flex rounded border-[1px] border-neutral-600/60">
                                                <input 
                                                    onChange={(e) => setNewPassword(e.target.value)} 
                                                    className="grow input"
                                                    id="new-password" 
                                                    name="new-password"
                                                    type={ togglePasswordDisplay?.new ? 'text': 'password' }
                                                />
                                                <button onClick={ ev => {
                                                    ev.preventDefault();
                                                    setTogglePasswordDisplay(state => ({ ...state, new: !state?.new }));
                                                 } } className="px-2" tabIndex="-1">
                                                    { togglePasswordDisplay?.new ? <Eye /> : <EyeOff /> }
                                                </button>
                                            </div>
                                            <ErrorField message={ invalidFieldsValue['password'] }/>
                                        </div>
                                    </>
                                :
                                    <div>
                                        <label htmlFor="password">Password</label>
                                        <div className="w-full flex rounded border-[1px] border-neutral-600/60">
                                            <input 
                                                value="Your password will not shown here to protect your creadential. To change it simply click the edit button below!"
                                                className="grow input opacity-70"
                                                id="password"
                                                type="password"
                                                disabled
                                            />
                                            <button className="px-2 opacity-70" disabled>
                                                <EyeOff />
                                            </button>
                                        </div>
                                        <ErrorField message={ invalidFieldsValue['password'] }/>
                                    </div>
                            }

                            {
                                editMode ?
                                    <div className="w-full flex gap-2">
                                        <button
                                            type="button"
                                            className="button w-1/2 mt-2 text-sm"
                                            onClick={ () => setEditMode(false) }
                                        >Cancel</button>
                                        <button
                                            type="submit"
                                            className="button w-1/2 mt-2 text-sm text-white bg-teal-500"
                                        >Update</button>
                                    </div>
                                :
                            
                                    <button 
                                        type="button"
                                        className="button w-full mt-2 text-sm text-white bg-teal-500"
                                        onClick={ () => setEditMode(true) }
                                    >
                                        Edit
                                    </button>
                            }
                            <ErrorField message={ invalidFieldsValue?.unauth }/>
                        </form>
                    </div>
                </section>
            </main>
            <FixMiniNavBar />
            <Footer />
        </div>
    );
}

export default Profile;
