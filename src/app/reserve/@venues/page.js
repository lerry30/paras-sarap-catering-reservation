'use client';
import { ChevronRight, Plus } from '@/components/icons/All';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getData } from '@/utils/send';
import { ErrorModal } from '@/components/Modal';
import { zReservation } from '@/stores/reservation';
import Link from 'next/link';
import CardSelect from '@/components/client/venues/CardSelect';
import Loading from '@/components/Loading';
import Breadcrumbs from '@/components/client/nav/Breadcrumbs'

const Venues = () => {
    const [ venues, setVenues ] = useState([]); // database
    const [ allSelects, setAllSelects ] = useState([]);
    const [ service, setService ] = useState(undefined);
    const [ series, setSeries ] = useState(1); // breadcrumbs
    const [ loading, setLoading ] = useState(false);
    const [ actionErrorMessage, setActionErrorMessage ] = useState('');

    const reservationCache = useRef(null);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };

    const next = () => {
        if(!allSelects.includes(true)) {
            setActionErrorMessage('Please ensure to choose a venue or provide information about the event location.');
            setTimeout(() => {
                setActionErrorMessage('');
            }, 2000);
            return;
        }
        
        const venueData = { index: allSelects.indexOf(true), length: allSelects.length, custom: false };
        localStorage.setItem('reservation-cache', JSON.stringify({ ...reservationCache.current, venue: venueData }));
        router.push(`/reserve?display=menus&service=${service}&set=1&series=${series}`);
    }

    const getVenues = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/venues')) || { data: [] };
            setVenues(data);
            setAllSelects(Array(data.length).fill(false));

            const venueCache = reservationCache.current?.venue;

            const setIndex = (updateNo) => {
                if(venueCache?.index) {
                    const index = venueCache?.index + updateNo;
                    setAllSelects(selects => { selects[index] = true; return selects });  
                }
            }
            
            // the cards are display in descending order so if admin adds new one, it would append in front
            // of the array so I add a new condition below to add to index so it can be selected still
            if(venueCache?.length === data?.length) setIndex(0);
            else if(venueCache?.length < data?.length) setIndex(data.length - venueCache.length);
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getVenues();
        //zReservation.getState()?.clearSpecificProperty('venue');
        const reservationCacheData = JSON.parse(localStorage.getItem('reservation-cache') || '{}');
        reservationCache.current = reservationCacheData;

        const serviceParam = searchParams.get('service');
        if(!services.hasOwnProperty(serviceParam)) router.push('/');
        setService(serviceParam);

        setSeries(searchParams.get('series'));
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" />}
            <Breadcrumbs step={ 2 }>
                <div className="w-full flex justify-end">
                    {/*  <h2 className="font-headings font-semibold">Venues</h2> */}
                    <div className="flex gap-2">
                        <Link href={ `/reserve?display=providevenuelocation&service=${service}&set=2&series=${series}` } className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                            <Plus size={20} />
                            <span className="text-sm font-medium hidden sm:inline">Choose your venue</span>
                        </Link>
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
                        venues.map((item, index) => {
                            if(item?.status === 'unavailable') return null;
                            return(
                                <CardSelect 
                                    key={ index } 
                                    index={ index }
                                    venueData={ item }
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

export default Venues;
