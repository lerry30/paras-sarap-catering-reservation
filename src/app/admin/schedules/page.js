'use client';
import Loading from '@/components/Loading';
import { ChevronLeft, ChevronRight } from '@/components/icons/All';
import { areDatesEqual } from '@/utils/date';
import { Suspense, useEffect, useState } from 'react';

const Schedules = () => {
    const [ loading, setLoading ] = useState(false);
    const [ startOfTheMonth, setStartOfTheMonth ] = useState(undefined);
    const [ endOfTheMonth, setEndOfTheMonth ] = useState(undefined);
    const [ currentMonth, setCurrentMonth ] = useState(0);
    const [ currentYear, setCurrentYear ] = useState(2024);
    const [ noOfRows, setNoOfRows ] = useState(5);
    
    const today = new Date();
    const dateObj = new Date();
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    const days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

    const setCalNumbers = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        setStartOfTheMonth(firstDay);
        setEndOfTheMonth(lastDay);

        const startDay = firstDay?.getDay() || -1;
        const endDay = lastDay?.getDate() || -1;
        setNoOfRows(Math.ceil((startDay + endDay) / 7) * 7);
    }

    const updateMonth = (direction) => {
        let nYear = 2024;
        const nMonth = (currentMonth+direction+12)%12
        setCurrentMonth(nMonth);

        if(direction === -1) {
            if(nMonth === 11) {
                nYear = currentYear+direction;
            }
        } else {
            if(nMonth === 0) {
                nYear = currentYear+direction;
            }
        }

        setCurrentYear(nYear);
        setCalNumbers(nYear, nMonth);
    }

    useEffect(() => {
        setCalNumbers(dateObj.getFullYear(), dateObj.getMonth());
        setCurrentMonth(dateObj.getMonth());
        setCurrentYear(dateObj.getFullYear());

        console.log(noOfRows);
    }, []);

    return (
        <Suspense fallback={ <Loading customStyle="size-full" /> }>
            <section className="flex h-[calc(100vh-var(--nav-height))] max-h-screen overflow-hidden p-4">
                { loading && <Loading customStyle="size-full" /> }
                <div className="grow flex flex-col">
                    <main className="flex flex-col gap-2">
                        <header>
                            <div className="flex items-center justify-between pr-2 pb-2">
                                {/* dateObj.toLocaleString('default', { month: 'long' }); // The best way to get the month name from a date */}
                                <h2 className="font-headings">{ `${ months[currentMonth] } ${ currentYear }` }</h2>
                                <h2 className="font-headings font-semibold">Schedules</h2>
                                <div className="flex gap-4">
                                    <button onClick={ () => updateMonth(-1) }><ChevronLeft size={20} /></button>
                                    <button onClick={ () => updateMonth(1) }><ChevronRight size={20} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-2 pr-2">
                                {
                                    days.map((day, index) => (
                                        <div key={ index } className="w-full p-2 flex justify-center bg-neutral-100">
                                            <span className="font-headings font-bold text-sm">{ day }</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </header>
                        <section className="grid grid-cols-7 gap-2 pr-2">
                            {
                                Array(noOfRows).fill(0).map((item, index) => {
                                    const startDay = startOfTheMonth?.getDay() || 100;
                                    const endDay = endOfTheMonth?.getDate() || -1;
                                    const number = index - startDay + 1;
                                    if(number > 0) {
                                        if(number <= endDay) {
                                            const milli = new Date(`${ months[currentMonth] } ${ number }, ${ currentYear }`);
                                            const isToday = areDatesEqual(today, milli);

                                            if(isToday) {
                                                return (
                                                        <div key={ index } className="w-full aspect-square p-2 border-[1px] border-neutral-400 cursor-pointer bg-red-800">
                                                            <span className="text-white font-bold">{ number }</span>
                                                    </div>
                                                )
                                            }
                                                

                                            return (
                                                    <div key={ index } className="w-full aspect-square p-2 border-[1px] border-neutral-400 cursor-pointer">
                                                    <span className="text-neutral-950">{ number }</span>
                                                </div>
                                            )
                                        }
                                    }

                                    return <div key={ index } className="w-full aspect-square p-2 bg-neutral-400/30"></div>
                                })
                            }
                        </section>
                    </main>
                </div>
                {/* list */}
                <div className="w-1/2 border-[1px] border-neutral-400">

                </div>
            </section>
        </Suspense>
    );
}

export default Schedules;