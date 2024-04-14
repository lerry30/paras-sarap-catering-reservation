'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import Link from 'next/link';

const Themes = () => {
    const [ themesObject, setThemesObject ] = useState({});
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // const getDrinks = async () => {
    //     const { data } = (await getData('/api/drinks')) || { data: [] };
    //     setDrinks(data);

    //     for(const drink of data) {
    //         setDrinksObject(prev => ({ ...prev, [ drink?._k ]: drink }));
    //     }
    // }

    useEffect(() => {
        const service = searchParams.get('service');
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-2 p-4 ">
                <h2 className="font-headings font-semibold">Themes</h2>
                <div className="w-full flex justify-center gap-2">
                    <Link href="/reserve?display=venues" className="mt-40 border-[1px] p-2 rounded-sm">Continue</Link>
                </div>
            </section>
        </>
    );
}

export default Themes;