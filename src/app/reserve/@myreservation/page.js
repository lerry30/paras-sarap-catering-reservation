'use client';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import Card from '@/components/client/reservations/Card';
import Loading from '@/components/Loading';

const MyReservations = () => {
    const [ reservations, setReservations ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const getResList = async () => {
        setLoading(true);
        try {
            const { data } = (await getData('/api/reservations/reservation')) || { data: [] };
            setReservations(data);
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getResList();
    }, []);

    return <>
        { loading && <Loading customStyle="size-full" /> }
        <div className="flex justify-between px-4 py-2 border-b-[1px] sticky top-[var(--nav-height)] bg-white z-subnav md:px-page-x">
            <div>
                <h2 className="font-headings font-semibold">My Reservation</h2>
            </div>
        </div>
        <section className="w-full h-[calc(100vh-var(--nav-height))] flex flex-col px-page-x py-2 overflow-auto hide-scrollbar">
            <div className="w-full flex flex-col pb-40">
                {
                    reservations.map((res, index) => {
                        // console.log(res);
                        return <Card 
                            key={ index } 
                            reservationData={ res }
                        />
                    })
                }
            </div>
        </section>
    </>
}

export default MyReservations;
    