'use client';
import Loading from '@/components/Loading';
import { getDaysInMonth } from '@/utils/date';
import { useEffect, useState } from 'react';

const Schedules = () => {
    const [ loading, setLoading ] = useState(false);
    const [ startOfTheMonth, setStartOfTheMonth ] = useState(undefined);
    const [ entireMonth, setEntireMonth ] = useState([]);

    const dateObj = new Date();
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    const days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

    useEffect(() => {
        const firstDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        const lastDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);

        setStartOfTheMonth(firstDay);
        setEntireMonth(getDaysInMonth(dateObj.getFullYear, dateObj.getMonth()));
    }, []);

    return (
        <section className="flex h-[calc(100vh-var(--nav-height))] max-h-screen overflow-hidden p-4">
            { loading && <Loading customStyle="size-full" /> }
            <div className="grow flex flex-col">
                <div className="flex justify-between items-center p-1 rounded-lg">
                    <h2 className="font-headings font-semibold">Schedules</h2>
                </div>
                <div>
                    <main className="flex flex-col gap-2">
                        <header>
                            {/* dateObj.toLocaleString('default', { month: 'long' }); // The best way to get the month name from a date */}
                            <h2 className="font-headings">{ `${ months[dateObj.getMonth()] } ${ dateObj.getFullYear() }` }</h2>
                            <div className="grid grid-cols-7 gap-2 px-2">
                                {
                                    days.map((day, index) => (
                                        <div key={ index } className="w-full p-2 flex justify-center bg-neutral-800">
                                            <span className="font-headings font-bold text-lg text-white">{ day }</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </header>
                        <section className="bg-orange-400 grid grid-cols-7 gap-2 px-2">
                            {
                                
                            }
                            <div className="w-full aspect-square bg-neutral-800"></div>
                        </section>
                    </main>
                </div>
            </div>
            {/* list */}
            <div className="w-1/4 bg-red-700">

            </div>
        </section>
    );
}

export default Schedules;