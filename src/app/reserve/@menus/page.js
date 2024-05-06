'use client';
import { ChevronRight, Plus } from '@/components/icons/All';
import { ErrorModal } from '@/components/Modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';

import Link from 'next/link';
import Loading from '@/components/Loading';
import CardSelect from '@/components/client/menus/CardSelect';
import { zReservation } from '@/stores/reservation';

const Menus = () => {
    const [ menus, setMenus ] = useState([]);
    const [ allSelects, setAllSelects ] = useState([]);
    const [ service, setService ] = useState(undefined);

    const [ actionErrorMessage, setActionErrorMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };

    const next = () => {
        if(!allSelects.includes(true)) {
            setActionErrorMessage('Please ensure to choose a menu or create custom menu for the event.');
            setTimeout(() => {
                setActionErrorMessage('');
            }, 2000);
            return;
        }

        router.push(`/reserve?display=schedule&service=${ service }`);
    }
    
    const getMenus = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/menus')) || { data: [] };
            setMenus(data);
            console.log(data);
            setAllSelects(Array(data.length).fill(false));
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getMenus();
        zReservation.getState()?.clearSpecificProperty('menu');

        const serviceParam = searchParams.get('service');
        if(!services.hasOwnProperty(serviceParam)) router.push('/');
        setService(serviceParam);
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-4 pb-6">
                <div className="px-page-x flex justify-between items-center py-4 sticky top-[var(--nav-height)] left-0 z-subnavbar bg-white border-b-[1px]">
                    <h2 className="font-headings font-semibold">Menus</h2>
                    <div className="flex gap-4">
                        <Link href={ `/reserve?display=createmenu&service=${ service }` } className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                            <Plus size={20} />
                            <span className="text-sm font-medium">Create menu</span>
                        </Link>
                        <button onClick={ next } className="flex gap-2 bg-green-600/40 rounded-full pr-2 py-1 pl-4 hover:bg-green-400 transition-colors">
                            <span className="text-sm font-medium">Next</span>
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start px-page-x">
                    {
                        menus.map((item, index) => {
                            return(
                                <CardSelect 
                                    key={ index } 
                                    index={ index }
                                    menuData={ item }
                                    allSelects={ allSelects }
                                    setAllSelects={ setAllSelects }
                                />
                            )
                        })
                    }
                </div>
            </section>
            {
                !!actionErrorMessage && <ErrorModal header="Oops! No Selection Made" message={ actionErrorMessage } callback={ () => setActionErrorMessage('') } />
            }
        </>
    );
}

export default Menus;