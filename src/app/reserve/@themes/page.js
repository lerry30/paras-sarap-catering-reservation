'use client';
import { ChevronRight, Plus } from '@/components/icons/All';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getData } from '@/utils/send';
import { ErrorModal } from '@/components/Modal';
import { zReservation } from '@/stores/reservation';
import Link from 'next/link';
import CardSelect from '@/components/client/themes/CardSelect';
import Loading from '@/components/Loading';
import Breadcrumbs from '@/components/client/nav/Breadcrumbs'

const Themes = () => {
    const [ themes, setThemes ] = useState([]); // database
    const [ allSelects, setAllSelects ] = useState([]);
    const [ series, setSeries ] = useState(1); // breadcrumbs
    const [ loading, setLoading ] = useState(false);
    const [ actionErrorMessage, setActionErrorMessage ] = useState('');

    const service = useRef(undefined);
    const reservationCache = useRef(null);
    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };

    const router = useRouter();
    const searchParams = useSearchParams();

    const next = () => {
        if(!allSelects.includes(true)) {
            setActionErrorMessage('Please ensure to choose a theme or provide information about the event location.');
            setTimeout(() => {
                setActionErrorMessage('');
            }, 2000);
            return;
        }
        
        const themeData = { index: allSelects.indexOf(true), length: allSelects.length, custom: false };
        localStorage.setItem('reservation-cache', JSON.stringify({ ...reservationCache.current, theme: themeData }));
        router.push(`/reserve?display=venues&service=${service.current}&set=1&series=${series}`);
    }


    const getThemes = async () => {
        setLoading(true);

        try {
            console.log(service);
            const eventApi = { wedding: 'wedding', debut: 'debut', kidsparty: 'kid', privateparty: 'private' };
            const endPoint = eventApi[service.current];
            const { data } = (await getData(`/api/themes/${endPoint}`)) || { data: [] };
            setThemes(data);
            setAllSelects(Array(data.length).fill(false));

            const themeCache = reservationCache.current?.theme;

            const setIndex = (updateNo) => {
                if(themeCache?.index) {
                    const index = themeCache?.index + updateNo;
                    setAllSelects(selects => { selects[index] = true; return selects });  
                }
            }
            
            // the cards are display in descending order so if admin adds new one, it would append in front
            // of the array so I add a new condition below to add to index so it can be selected still
            if(themeCache?.length === data?.length) setIndex(0);
            else if(themeCache?.length < data?.length) setIndex(data.length - themeCache.length);
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        const serviceParam = searchParams.get('service');
        if(!services.hasOwnProperty(serviceParam)) router.push('/');
        service.current = serviceParam;

        setSeries(searchParams.get('series'));
        
        getThemes();

        const reservationCacheData = JSON.parse(localStorage.getItem('reservation-cache') || '{}');
        reservationCache.current = reservationCacheData;
        localStorage.setItem('reservation-cache', JSON.stringify({ ...reservationCacheData, theme: {} }));
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" />}
            <Breadcrumbs step={ 1 }>
                <div className="w-full flex justify-end">
                    {/*  <h2 className="font-headings font-semibold">Themes</h2> */}
                    <div className="flex gap-2">
                        <button onClick={ next } className="flex gap-2 bg-green-600/40 rounded-full pr-2 py-1 pl-4 hover:bg-green-400 transition-colors">
                            <span className="text-sm font-medium hidden sm:inline">Next</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </Breadcrumbs>
            <section className="flex flex-col gap-4 pb-6">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start px-page-x pt-[var(--nav-height)]">
                    {
                        themes.map((item, index) => {
                            if(item?.status === 'unavailable') return null;
                            return(
                                <CardSelect 
                                    key={ index } 
                                    index={ index }
                                    themeData={ item }
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

export default Themes;
