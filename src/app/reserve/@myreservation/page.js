'use client';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import Card from '@/components/client/reservations/Card';
import Loading from '@/components/Loading';
import Link from 'next/link';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectionReasons, setRejectionReasons] = useState({});
    const [ additionalServiceTimeCostPerHour, setAdditionalServiceTimeCostPerHour ] = useState(1000);

    const removeItem = (dateAsKey) => {
        if(!dateAsKey) return;
        setReservations(state => state.filter(item => item.dateAsKey !== dateAsKey));
    }

    const fetchReservations = async () => {
        try {
            const { data } = (await getData('/api/reservations/reservation')) || { data: [] };
            const newReservations = data.map(fData => {
                const reservationDate = new Date(fData?.createdAt);
                const dateAsKey = reservationDate.getTime();
                return { ...fData, dateAsKey };
            });

            setReservations(newReservations);
        } catch (error) {
            console.error("Error fetching reservations", error);
        }
        setLoading(false);
    };

    const fetchRejectionReasons = async () => {
        try {
            const { data } = (await getData('/api/reservations/reservation/rejection')) || { data: [] };
            const newReasons = data.reduce((acc, fData) => {
                const reservationDate = new Date(fData?.createdAt);
                const dateAsKey = reservationDate.getTime();
                acc[dateAsKey] = fData.reason;
                return acc;
            }, {});
            setRejectionReasons(newReasons);
            // setRejectionReasons(prevReasons => ({ ...prevReasons, ...newReasons }));
        } catch (error) {
            console.error("Error fetching rejection reasons", error);
        }
    };

    const getAdditionalServiceTimeCost = async () => {
        try {
            const response = await getData('/api/policies/reservation/servicetime');
            const cost = toNumber(response?.data?.additionalServiceTimeCostPerHour);
            setAdditionalServiceTimeCostPerHour(cost);
        } catch(error) {}
    }

    useEffect(() => {
        setLoading(true);
        fetchReservations();

        const intervalId = setInterval(() => {
            fetchRejectionReasons();
            fetchReservations();
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            {loading && <Loading customStyle="size-full" />}
            <div className="flex justify-between px-4 py-2 border-b-[1px] sticky top-[var(--nav-height)] bg-white z-subnav md:px-page-x">
                <div>
                    <h2 className="font-headings font-semibold">My Reservation</h2>
                </div>
            </div>
            <section className="w-full h-[calc(100vh-var(--nav-height))] flex flex-col px-page-x py-2 overflow-auto hide-scrollbar">
                {reservations.length === 0 ? (
                    <div className="size-full flex flex-col justify-center items-center gap-2">
                        <h3 className="font-headings text-lg text-neutral-700">No Reservations Found</h3>
                        <Link href="/services" className="font-headings font-semibold bg-skin-ten text-white px-4 py-2 mt-2">
                            Reserve Now
                        </Link>
                    </div>
                ) : (
                    <div className="w-full flex flex-col pb-40">
                        {reservations.map((res, index) => {
                            const dateAsKey = res?.dateAsKey;
                            const reason = rejectionReasons[dateAsKey] || '';

                            return (
                                <Card 
                                    key={index} 
                                    reservationData={res} 
                                    rejectionReason={reason} 
                                    removeItself={removeItem}
                                    additionalTimeRate={ additionalServiceTimeCostPerHour }
                                />
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );
};

export default MyReservations;

    
