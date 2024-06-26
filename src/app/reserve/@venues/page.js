'use client';
import { ChevronRight, Plus } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getData } from '@/utils/send';
import { ErrorModal } from '@/components/Modal';
import { zReservation } from '@/stores/reservation';
import Link from 'next/link';
import CardSelect from '@/components/client/venues/CardSelect';
import Loading from '@/components/Loading';

const Venues = () => {
    const [ venues, setVenues ] = useState([]); // database
    const [ allSelects, setAllSelects ] = useState([]);
    const [ service, setService ] = useState(undefined);
    const [ loading, setLoading ] = useState(false);
    const [ actionErrorMessage, setActionErrorMessage ] = useState('');
    
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

        router.push(`/reserve?display=menus&service=${ service }`);
    }

    const getVenues = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/venues')) || { data: [] };
            setVenues(data);
            setAllSelects(Array(data.length).fill(false));
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getVenues();
        zReservation.getState()?.clearSpecificProperty('venue');

        const serviceParam = searchParams.get('service');
        if(!services.hasOwnProperty(serviceParam)) router.push('/');
        setService(serviceParam);
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" />}
            <section className="flex flex-col gap-4 pb-6">
                <div className="px-page-x flex justify-between items-center py-4 fixed top-[var(--nav-height)] left-0 right-0 z-subnavbar bg-white border-b-[1px]">
                    <h2 className="font-headings font-semibold">Venues</h2>
                    <div className="flex gap-4">
                        <Link href={ `/reserve?display=providevenuelocation&service=${ service }` } className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                            <Plus size={20} />
                            <span className="text-sm font-medium">Choose your venue</span>
                        </Link>
                        <button onClick={ next } className="flex gap-2 bg-green-600/40 rounded-full pr-2 py-1 pl-4 hover:bg-green-400 transition-colors">
                            <span className="text-sm font-medium">Next</span>
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start px-page-x pt-[calc(var(--nav-height)+16px)]">
                    {
                        venues.map((item, index) => {
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