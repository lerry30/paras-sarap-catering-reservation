'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import Link from 'next/link';

const Themes = () => {
    const [ themesObject, setThemesObject ] = useState({});
    const [ service, setService ] = useState(undefined);
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // const getDrinks = async () => {
        // setLoading(true);
    //     const { data } = (await getData('/api/drinks')) || { data: [] };
    //     setDrinks(data);

    //     for(const drink of data) {
    //         setDrinksObject(prev => ({ ...prev, [ drink?._k ]: drink }));
    //     }
        // setLoading(false);
    // }

    useEffect(() => {
        const serviceParam = searchParams.get('service');
        setService(serviceParam);
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col">
                {/* <h2 className="font-headings font-semibold">Themes</h2> */}
                <div className="w-full h-[calc(100vh-var(--nav-height)-20px)] flex flex-col justify-center items-center gap-2">
                    <h1 className="font-headings font-bold text-xl">Themes</h1>
                    <p className="font-paragraphs font-bold text-lg text-neutral-700/40">UNAVAILABLE FOR NOW</p>
                    <Link href={ `/reserve?display=venues&service=${ service }` } className="font-headings font-bold border-[1px] py-2 px-4 rounded-sm shadow-xl hover:bg-skin-ten hover:text-white transition-colors">Continue</Link>
                </div>
            </section>
        </>
    );
}

export default Themes;