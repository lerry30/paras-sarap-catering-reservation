import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleUserRound } from '@/components/icons/All'
import Loading from '@/components/Loading';
import signout from '@/utils/auth/signout';

const Avatar = ({ name }) => {
    const [ open, setOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);
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

    useEffect(() => {
        addEventListener('click', focusOutside);
        return () => removeEventListener('click', focusOutside);
    }, []);

    return (
        <>
            { loading && <Loading customStyle="w-full min-h-screen" /> }
            <div ref={ dropdown } className="relative p-1">
                <button onClick={ toggle } className="h-full aspect-square rounded-full">
                    <CircleUserRound strokeWidth={1} className="size-full" />
                </button>
                <div className={ `fixed right-2 min-w-40 flex-col items-center justify-center mt-1 p-2 border border-neutral-300 shadow-lg bg-white ${ open ? 'flex' : 'hidden' }` }>
                    <CircleUserRound size={100} strokeWidth={1} stroke="black" className="" />
                    <h1 className="text-nowrap">{ name }</h1>
                    <button className="w-full shadow-sm text-md" onClick={ signoutHandler }>Sign out</button>
                </div>
            </div>
        </>
    );
}

export default Avatar;