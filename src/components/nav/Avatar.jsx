import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleUserRound } from '@/components/icons/All'
import { getData } from '@/utils/send.js';
import ProfileImage from '@/components/ProfileImage';
import Loading from '@/components/Loading';
import signout from '@/utils/auth/signout';
import Link from 'next/link';

const Avatar = ({ name='', image=undefined }) => {
    const [ open, setOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ profilePath, setProfilePath ] = useState('/profile');
    const dropdown = useRef(null);

    const router = useRouter();

    const signoutHandler = async () => {
        setLoading(true);
        const isSignedout = await signout();
        if(isSignedout) console.log('signed out');
        router.push('/signin');
    }
    
    const toggle = () => setOpen(state => !state);
    const focusOutside = (ev) => {
        if(!dropdown.current?.contains(ev.target)) {
            setOpen(false);
        }
    }

    const pathForProfile = async () => {
        try {
            const requestPath = await getData('/api/users/avatar');
            if(requestPath?.success) {
                setProfilePath(requestPath?.data);
            }
        } catch(error) {}
    }

    useEffect(() => {
        pathForProfile();

        addEventListener('click', focusOutside);
        return () => removeEventListener('click', focusOutside);
    }, []);

    return (
        <>
            { loading && <Loading customStyle="w-full min-h-screen" /> }
            <div ref={ dropdown } className="relative p-1">
                <button onClick={ toggle } className="h-full aspect-square rounded-full">
                    <ProfileImage image={ image } className="size-[40px]" /> 
                </button>
                <div className={ `fixed right-2 min-w-40 flex-col items-center justify-center mt-1 border border-neutral-300 shadow-lg bg-white ${ open ? 'flex' : 'hidden' }` }>
                    <ProfileImage image={ image } className="size-[120px] p-2" size={ 120 } />
                    <h1 className="text-nowrap">{ name }</h1>
                    <div className="w-full flex flex-col gap-1 p-2 border-t border-neutral-200 [&>*]:px-2">
                        <Link href={ profilePath } className="w-full text-md hover:bg-skin-ten hover:text-white hover:font-semibold rounded-md">Your profile</Link>
                        <button className="w-full shadow-sm text-md text-left hover:bg-skin-ten hover:text-white hover:font-semibold rounded-md" onClick={ signoutHandler }>Sign out</button>
                    </div>                   
                </div>
            </div>
        </>
    );
}

export default Avatar;
