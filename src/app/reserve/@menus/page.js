'use client';
import { ChevronRight, Plus } from '@/components/icons/All';
import { ErrorModal } from '@/components/Modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getData } from '@/utils/send';

import Link from 'next/link';
import Loading from '@/components/Loading';
import CardSelect from '@/components/client/menus/CardSelect';
import Breadcrumbs from '@/components/client/nav/Breadcrumbs';
import { zReservation } from '@/stores/reservation';
import { getSetParam } from '@/utils/client/breadcrumbs/params';

const Menus = () => {
    const [ menus, setMenus ] = useState([]);
    const [ allSelects, setAllSelects ] = useState([]);
    const [ service, setService ] = useState(undefined);
    const [ setParam, setSetParam ] = useState(1); // for breadcrumbs
    const [ series, setSeries ] = useState(1); // breadcrumbs

    const [ actionErrorMessage, setActionErrorMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const reservationCache = useRef(null);

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

        const menuData = { index: allSelects.indexOf(true), length: allSelects.length, custom: false };
        localStorage.setItem('reservation-cache', JSON.stringify({ ...reservationCache.current, menu: menuData }));
        router.push(`/reserve?display=schedule&service=${service}&set=${setParam}&series=${series}`);
    }
    
    const getMenus = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/menus')) || { data: [] };
            setMenus(data);
            // console.log(data);
            setAllSelects(Array(data.length).fill(false));
  
            const menuCache = reservationCache.current?.menu;

            const setIndex = (updateNo) => {
                if(menuCache?.index) {
                    const index = menuCache?.index + updateNo;
                    setAllSelects(selects => { selects[index] = true; return selects });  
                }
            }
            
            // the cards are display in descending order so if admin adds new one, it would append in front
            // of the array so I add a new condition below to add to index so it can be selected still
            if(menuCache?.length === data?.length) setIndex(0);
            else if(menuCache?.length < data?.length) setIndex(data.length - menuCache.length);
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getMenus();
        // zReservation.getState()?.clearSpecificProperty('menu');
        const reservationCacheData = JSON.parse(localStorage.getItem('reservation-cache') || '{}');
        reservationCache.current = reservationCacheData;

        const serviceParam = searchParams.get('service');
        if(!services.hasOwnProperty(serviceParam)) router.push('/');
        setService(serviceParam);

        const filteredSet = getSetParam(searchParams);
        setSetParam(filteredSet);

        setSeries(searchParams.get('series'));
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <Breadcrumbs step={ 3 }>
                <div className="w-full flex justify-end">
                    {/*  <h2 className="font-headings font-semibold ml-[300px]">Packages</h2> */}
                    <div className="flex gap-4">
                        <Link href={ `/reserve?display=createmenu&service=${ service }&set=${ (setParam+2) }&series=${ series }` } className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                            <Plus size={20} />
                            <span className="text-sm font-medium hidden sm:inline">Create menu</span>
                        </Link>
                        <button onClick={ next } className="flex gap-2 bg-green-600/40 rounded-full pr-2 py-1 pl-4 hover:bg-green-400 transition-colors">
                            <span className="text-sm font-medium hidden sm:inline">Next</span>
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>
            </Breadcrumbs>
            <section className="flex flex-col gap-4 pt-[var(--nav-height)] pb-6">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start px-page-x">
                    {
                        menus.map((item, index) => {
                            if(item?.status === 'unavailable') return null;
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
