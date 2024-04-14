'use client';
import Link from 'next/link';
import { Plus } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import CardSelect from '@/components/client/venues/CardSelect';

const Venues = () => {
    const [ venues, setVenues ] = useState([]); // database
    const [ allSelects, setAllSelects ] = useState([]);

    const getVenues = async () => {
        const { data } = (await getData('/api/venues')) || { data: [] };
        setVenues(data);

        console.log(data);

        setAllSelects(Array(data.length).fill(false));
    }

    useEffect(() => {
        getVenues();
    }, []);

    return (
        <section className="flex flex-col gap-2 px-page-x ">
            <div>
                <div className="flex justify-between items-center py-4 rounded-lg">
                    <h2 className="font-headings font-semibold">Venues</h2>
                    <Link href="/reserve/hasownvenue" className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Choose your venue</span>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-4">
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
            </div>
        </section>
    );
}

export default Venues;