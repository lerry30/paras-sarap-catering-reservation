'use client';
import Loading from '@/components/Loading';
import Link from 'next/link';
import ErrorField from '@/components/ErrorField';
import SNavbar from '@/components/nav/SNavbar';
import TimePicker from '@/components/TimePicker';
import Breadcrumbs from '@/components/client/nav/Breadcrumbs';
import { ErrorModal } from '@/components/Modal';
import { ChevronLeft, ChevronRight } from '@/components/icons/All';
import { areDatesEqual } from '@/utils/date';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { zReservation } from '@/stores/reservation';
import { toNumber } from '@/utils/number';
import { getSetParam } from '@/utils/client/breadcrumbs/params';

const Schedules = () => {
    const [ loading, setLoading ] = useState(false);
    const [ startOfTheMonth, setStartOfTheMonth ] = useState(undefined);
    const [ endOfTheMonth, setEndOfTheMonth ] = useState(undefined);
    const [ currentMonth, setCurrentMonth ] = useState(0);
    const [ currentYear, setCurrentYear ] = useState(2024);
    const [ noOfRows, setNoOfRows ] = useState(5);

    const [ selectedDay, setSelectedDay ] = useState(undefined);
    const [ actionCantSchedDate, setActionCantSchedDate ] = useState('');
    const [ actionSavingError, setActionSavingError ] = useState('');
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});

    const [ fromHour, setFromHour ] = useState('');
    const [ fromMinute, setFromMinute ] = useState('');
    const [ fromMeridiem, setFromMeridiem ] = useState('');
    const [ toHour, setToHour ] = useState('');
    const [ toMinute, setToMinute ] = useState('');
    const [ toMeridiem, setToMeridiem ] = useState('');

    const prevSelectedElement = useRef(undefined);

    const [ service, setService ] = useState(undefined);
    const [ setParam, setSetParam ] = useState(1);
    const [ series, setSeries ] = useState(1);
    const searchParams = useSearchParams();
    const router = useRouter();

    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };
    
    const today = new Date();
    const dateObj = new Date();
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    const days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

    const noOfUnpickableDaysStartFromNow = 3;
    const noOfDaysCanSched = 1000 * 60 * 60 * 24 * noOfUnpickableDaysStartFromNow;

    const setCalNumbers = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        
        setStartOfTheMonth(firstDay);
        setEndOfTheMonth(lastDay);
        
        const startDay = firstDay?.getDay();
        const endDay = lastDay?.getDate();
        setNoOfRows(Math.ceil((startDay + endDay) / 7) * 7);
    }

    const updateMonth = (direction) => {
        let nYear = currentYear;
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

        if(prevSelectedElement.current) {
            prevSelectedElement.current.style.opacity = '.01';
            setSelectedDay('');
        }
    }

    // save button to finish things up
    const saveScheduledDate = () => {
        setLoading(true);
        setInvalidFieldsValue({});

        try {
            const noDateSelectionMade = !selectedDay ? 'No Date Selection Made!' : '';
            const errorStartTime = validateTimeInput(fromHour, fromMinute, fromMeridiem, 'Please specify the appropriate start time.');
            const errorEndTime = validateTimeInput(toHour, toMinute, toMeridiem, 'Please indicate the appropriate end time.');

            setInvalidFieldsValue(state => ({ ...state, date: noDateSelectionMade }));
            setInvalidFieldsValue(state => ({ ...state, 'time-from': errorStartTime }));
            setInvalidFieldsValue(state => ({ ...state, 'time-to': errorEndTime }));
           
            const fFromHour = toNumber(fromHour)?.toString()?.padStart(2, '0');
            const fFromMinute = toNumber(fromMinute)?.toString()?.padStart(2, '0');

            const fToHour = toNumber(toHour)?.toString()?.padStart(2, '0');
            const fToMinute = toNumber(toMinute)?.toString()?.padStart(2, '0');

            if(!noDateSelectionMade && !errorStartTime && !errorEndTime) {
                const fromTime = `${ fFromHour }: ${ fFromMinute } ${ fromMeridiem }`;
                const toTime = `${ fToHour }: ${ fToMinute } ${ toMeridiem }`;
                const data = {
                    date: selectedDay,
                    time: {
                        from: fromTime,
                        to: toTime,
                    }
                }

                zReservation?.getState()?.saveScheduledDateData(data);
                router.push(`/reserve?display=reviewbudget&service=${service}&set=${setParam}&series=${series}`);
            }
        } catch(error) {
            console.log(error);
            setActionSavingError('Sorry some featuers are not available right now!');
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }

        setLoading(false);
    }

    // clicked the day in calendar
    const setSched = (ev, number) => {
        const day = ev.target.closest('.box')
        const dateToString = `${ months[currentMonth] } ${ number }, ${ currentYear }`;
        // getTime() -> to milliseconds
        const earliestDayCanReserve = today.getTime() + noOfDaysCanSched;
        const selectedDate = new Date(dateToString);
        const selectedDateInMilli = selectedDate?.getTime();

        // already selected
        if(selectedDay) {
            const prevDate = new Date(selectedDay);
            if(areDatesEqual(prevDate, selectedDate)) {
                console.log('are equal');
                prevSelectedElement.current.style.opacity = '.01';
                setSelectedDay('');
                return;
            }
        }

        if(prevSelectedElement.current)
            prevSelectedElement.current.style.opacity = '.01';

        if(selectedDateInMilli > earliestDayCanReserve) {
            day.style.opacity = '1';
            prevSelectedElement.current = day;
            setSelectedDay(dateToString);
        } else {
            setActionCantSchedDate('The date cannot be selected at this time due to the preparation and planning required for your event. Negotiations and arrangements between both parties need to be finalized, along with other necessary preparations. Thank you for your understanding.');
            setTimeout(() => setActionCantSchedDate(''), 5000);
        }
    }

    // validate time
    const validateTimeInput = (hour, minute, meridiem, message) => {
        const nHour = toNumber(hour);
        const nMinute = toNumber(minute);

        if(nHour <= 0 || nHour > 12)
            return message;
        if(nMinute < 0 || nMinute > 59)
            return message;
        if(meridiem !== 'am' && meridiem !== 'pm') 
            return message;
    }

    useEffect(() => {
        setCalNumbers(dateObj.getFullYear(), dateObj.getMonth());
        setCurrentMonth(dateObj.getMonth());
        setCurrentYear(dateObj.getFullYear());
        zReservation.getState()?.clearSpecificProperty('schedule');

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
            <Breadcrumbs step={ 4 }>
                <div className="w-full flex justify-end">
                    {/*  <h2 className="font-headings font-semibold ml-[200px]">Schedule</h2> */}
                    <div className="flex gap-2">
                        <button onClick={ saveScheduledDate } className="flex gap-2 bg-green-600/40 rounded-full pr-2 py-1 pl-4 hover:bg-green-400 transition-colors">
                            <span className="text-sm font-medium hidden sm:inline">Next</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </Breadcrumbs>
            <section className="flex flex-col min-h-[calc(100vh-(var(--nav-height)*2))] overflow-hidden py-[var(--nav-height)] sm:px-page-x  md:flex-row">
                <div className="grow flex flex-col">
                    <main className="flex flex-col gap-2">
                        <header>
                            <div className="flex items-center justify-between pr-2 pb-2">
                                {/* dateObj.toLocaleString('default', { month: 'long' }); // The best way to get the month name from a date */}
                                <h2 className="font-headings">{ `${ months[currentMonth] } ${ currentYear }` }</h2>
                                <h2 className="font-headings font-semibold">Calendar</h2>
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
                        <section className="grid grid-cols-7 gap-2 pr-2 font-paragraphs">
                            {
                                Array(noOfRows).fill(0).map((item, index) => {
                                    const startDay = startOfTheMonth?.getDay();
                                    const endDay = endOfTheMonth?.getDate();
                                    const number = index - startDay + 1;

                                    if(number > 0) {
                                        if(number <= endDay) {
                                            const milli = new Date(`${ months[currentMonth] } ${ number }, ${ currentYear }`);
                                            const isToday = areDatesEqual(today, milli);

                                            if(isToday) {
                                                return (
                                                        <div key={ index } className="w-full aspect-square overflow-hidden p-1 border-[1px] border-neutral-400 cursor-pointer bg-skin-ten flex flex-col">
                                                            <span className="text-white font-bold">{ number }</span>
                                                            <span className="text-neutral-200 text-sm font-semibold">Today</span>
                                                    </div>
                                                )
                                            }
                                            
                                            // unpickable days start from now for preparations
                                            const range = number - today.getDate();
                                            if(currentMonth === (new Date()).getMonth() && currentYear === (new Date()).getFullYear()) {
                                                if(range > 0 && range <= noOfUnpickableDaysStartFromNow) {
                                                    return (
                                                        <div key={ index } className="w-full aspect-square overflow-hidden p-1 border-[1px] border-neutral-400 cursor-pointer bg-neutral-400 flex flex-col">
                                                            <span className="text-white font-bold min-w-[50px]">{ number }</span>
                                                            <span className="text-neutral-200 text-[12px] font-semibold mt-auto overflow-clip">unavailable</span>
                                                        </div>
                                                    )
                                                }
                                            }

                                            // past
                                            if(milli.getTime() < today.getTime()) {
                                                return (
                                                    <div key={ index } className="w-full aspect-square overflow-hidden p-1 border-[1px] border-neutral-600 cursor-pointer bg-neutral-600 flex flex-col">
                                                        <span className="text-white font-bold min-w-[50px]">{ number }</span>
                                                    </div>
                                                )
                                            }

                                            return (
                                                <div key={ index } className="relative w-full aspect-square p-1 border-[1px] border-neutral-400 cursor-pointer">
                                                    {/* default */}
                                                    <span className="text-neutral-950">{ number }</span>
                                                    
                                                    {/* selected display */}
                                                    <div onClick={ ev => setSched(ev, number) } className="box absolute top-0 left-0 right-0 bottom-0 opacity-[0.01] bg-blue-700 p-1">
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-bold">{ number }</span>
                                                            <span className="text-neutral-200 text-[12px] text-wrap font-semibold w-full">{ service }</span>
                                                        </div>
                                                    </div>
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
                <div className="w-full md:w-1/2 border-[1px] border-neutral-400 flex flex-col px-8 py-6 mt-4 md:mt-0">
                    <div className="flex flex-col font-semibold">
                        <h3>Enter the time</h3>
                        <div className="w-full flex gap-4 py-2">
                            <div className="w-1/2 flex flex-col">
                                <h4>From:</h4>
                                <TimePicker 
                                    useHour={ [ fromHour, setFromHour ] }  
                                    useMinute={ [ fromMinute, setFromMinute ] }  
                                    useMeridiem={ [ fromMeridiem, setFromMeridiem ] }  
                                />
                                <ErrorField message={ invalidFieldsValue['time-from'] }/>
                            </div>
                            <div className="w-1/2 flex flex-col">
                                <h4>To:</h4>
                                <TimePicker 
                                    useHour={ [ toHour, setToHour ] }  
                                    useMinute={ [ toMinute, setToMinute ] }  
                                    useMeridiem={ [ toMeridiem, setToMeridiem ] }  
                                />
                                <ErrorField message={ invalidFieldsValue['time-to'] }/>
                            </div>
                        </div>
                    </div>
                        
                    <div className="mt-auto flex flex-col gap-2 py-2 border-t-[1px] border-neutral-400">
                        <h2 className="font-headings font-bold text-2xl">{ selectedDay && selectedDay }</h2>
                        <article className="font-paragraphs">{ selectedDay && `Day of the ${ service }` }</article>

                        <div className="p-8 bg-blue-500/40 rounded-md">
                            <p className="font-paragraphs text-sm text-blue-900">Keep in mind that preparations and planning takes time so there's unpickable date starts today, usually it's not taking 3 or 5 days from the date you would reserved. Additionally there are certain date where already taken, and some date where unavailble our services, any request and questions or any concern may ask in our contact page <Link href="/contact">Message me</Link>.</p>
                        </div>

                        <ErrorField message={ invalidFieldsValue['date'] }/>
                    </div>
                </div>
            </section>
            {
                !!actionCantSchedDate && <ErrorModal header="Oops! Date Unselectable." message={ actionCantSchedDate } callback={ () => setActionCantSchedDate('') } />
            }

            {
                !!actionSavingError && <ErrorModal header="Oops! There's something wrong!" message={ actionSavingError } callback={ () => setActionSavingError('') } />
            }
        </>
    );
}

export default Schedules;
