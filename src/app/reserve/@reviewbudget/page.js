'use client';

import Loading from '@/components/Loading';
import ErrorField from '@/components/ErrorField';
import Image from 'next/image';
import SNavbar from '@/components/nav/SNavbar';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zReservation } from '@/stores/reservation';
import { toNumber } from '@/utils/number';
import { PromptAgreement, SuccessModal } from '@/components/Modal';
import { sendJSON } from '@/utils/send';

const ReviewBudget = () => {
    // State declarations
    const [venue, setVenue] = useState({});
    const [menu, setMenu] = useState({});
    const [schedule, setSchedule] = useState({});
    const [noOfGuest, setNoOfGuest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [listOfDishes, setListOfDishes] = useState([]);
    const [listOfDrinks, setListOfDrinks] = useState([]);
    const [fullAddress, setFullAddress] = useState('');
    const [agreementPrompt, setAgreementPrompt] = useState(false);
    const [service, setService] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [reservationSuccess, setReservationSuccess] = useState(false);
    const [invalidFieldsValue, setInvalidFieldsValue] = useState({});
    const [displaySummary, setDisplaySummary] = useState(false);

    // Constants
    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };
    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
    const dateFormatter = new Intl.DateTimeFormat('en-PH', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    const costOfTablesNChairsPerGuest = 20;

    // Hooks
    const searchParams = useSearchParams();
    const router = useRouter();

    // Function to validate the number of guests
    const checkNoOfGuest = () => {
        if (toNumber(noOfGuest) === 0) {
            setInvalidFieldsValue({ noofguest: 'Enter a numerical value greater than zero for the number of guests' });
            return;
        }
        setAgreementPrompt(true);
    };

    // Function to handle the agreement confirmation
    const agree = async () => {
        setAgreementPrompt(false);
        setLoading(true);

        if (!services.hasOwnProperty(service)) router.push('/');
        try {
            const data = {
                event: String(service).toLowerCase().trim(),
                venue,
                menu: {
                    name: menu?.menu,
                    description: menu?.description,
                    listofdishes: listOfDishes,
                    listofdrinks: listOfDrinks,
                },
                date: {
                    day: schedule?.date,
                    time: schedule?.time,
                },
                noofguest: noOfGuest,
            };

            await sendJSON(`/api/reservations`, data);
            setReservationSuccess(true);
            setTimeout(() => {
                router.push('/reserve?display=myreservations');
            }, 4000);
        } catch (error) {
            setInvalidFieldsValue({ error: error?.message || '' });
        }

        setLoading(false);
    };

    // Function to handle number of guests input change
    const guestNoInput = (ev) => {
        const value = ev.target.value;
        const noOfGuest = toNumber(value);
        ev.target.value = noOfGuest;
        setNoOfGuest(noOfGuest);
        zReservation.getState().saveNoOfGuest(noOfGuest);

        if (isNaN(Number(value))) {
            setInvalidFieldsValue(prev => ({ ...prev, noofguest: 'Please enter a numerical value for the number of guests.' }));
            return;
        }

        console.table(listOfDishes);

        const dishesCostPerGuestServed = listOfDishes.reduce((holder, dish) => holder + (dish?.status !== 'available' ? 0 : (dish?.costperhead || 0)), 0);
        const drinksCostPerGuestServed = listOfDrinks.reduce((holder, drink) => holder + (drink?.status !== 'available' ? 0 : (drink?.costperhead || 0)), 0);
        const venuePrice = venue?.price || 0;
        const totalCostForTableNChairs = venue?.tablesnchairsprovided ? 0 : costOfTablesNChairsPerGuest;
        const totalPaymentPerGuest = (dishesCostPerGuestServed + drinksCostPerGuestServed + totalCostForTableNChairs) * noOfGuest;
        const total = totalPaymentPerGuest + (noOfGuest ? venuePrice : 0);
        setTotalPayment(total);
    };

    // Function to set the address
    const setAddress = ({ street, barangay, municipality, province }) => {
        if (!street || !barangay || !municipality || !province)
            router.push(`/reserve?display=schedule&service=${service}`);
        const fAddress = `${street}, ${barangay}, ${municipality}, ${province}`;
        setFullAddress(fAddress);
    };

    // useEffect to load initial data
    useEffect(() => {
        const sVenue = zReservation.getState()?.venue;
        const sMenu = zReservation.getState()?.menu;
        const sSchedule = zReservation.getState()?.schedule;
        const sNoOfGuest = zReservation.getState()?.noOfGuest;

        setVenue(sVenue);
        setMenu(sMenu);
        setSchedule(sSchedule);
        setNoOfGuest(sNoOfGuest);

        setAddress(sVenue?.address);

        const listOfDishes = Object.values(sMenu?.dishes || {});
        const listOfDrinks = Object.values(sMenu?.drinks || {});

        setListOfDishes(listOfDishes);
        setListOfDrinks(listOfDrinks);

        const serviceParam = searchParams.get('service');
        if (!services.hasOwnProperty(serviceParam)) router.push('/');
        setService(serviceParam);
    }, []);

    return (
        <section className="flex flex-col">
            {loading && <Loading customStyle="size-full" />}
            <SNavbar href={ `/reserve?display=schedule&service=${ service }` } headerClassName="fixed top-[var(--nav-height)] h-fit z-subnavbar bg-white" />
            <div className="flex flex-col md:flex-row md:pr-[calc(24vw-8px)]">
                <main className="flex flex-col gap-10 divide-y-[1px] px-page-x py-4 flex-1">
                    <section className="flex flex-col gap-4 py-2">
                        <h1 className="font-headings font-semibold text-lg">Venue</h1>
                        <div className="flex flex-col md:flex-row gap-6">
                            {venue?.filename && (
                                <div className="w-[150px] aspect-square">
                                    <Image
                                        src={venue.filename}
                                        alt={venue?.name || ''}
                                        width={200}
                                        height={200}
                                        sizes="100%"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transformOrigin: 'center',
                                            borderRadius: '4px',
                                        }}
                                        priority
                                    />
                                </div>
                            )}
                            <div>
                                {venue?.name && <h2 className="font-headings font-semibold">{venue?.name}</h2>}
                                {venue?.description && <p className="font-paragraphs text-neutral-500 text-sm">{venue?.description}</p>}
                                {fullAddress && <h3 className="font-paragraphs italic text-lg font-semibold">{fullAddress}</h3>}
                                {venue?.maximumSeatingCapacity && (
                                    <article>
                                        <span className="font-headings text-sm">Maximum Seating Capacity:&nbsp;</span>
                                        <span className="font-paragraphs font-semibold">{venue.maximumSeatingCapacity}</span>
                                    </article>
                                )}
                                {venue?.price && (
                                    <article>
                                        <span className="font-headings text-sm">Price:&nbsp;</span>
                                        <span className="font-paragraphs font-semibold">{pesoFormatter.format(venue?.price)}</span>
                                    </article>
                                )}
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col gap-4 py-2">
                        <h1 className="font-headings font-semibold text-lg">Menu</h1>
                        <div className="flex flex-col">
                            {menu?.name && <h2 className="font-headings font-semibold">{menu?.name}</h2>}
                            {menu?.description && <p className="font-paragraphs text-neutral-500 text-sm">{menu?.description}</p>}
                            <div className="w-full flex flex-col md:flex-row justify-around gap-8 py-4">
                                {Object.values(menu?.dishes || {}).length > 0 && (
                                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                                        <h3 className="font-headings text-sm font-semibold">Dishes</h3>
                                        {listOfDishes?.map((dish, index) => {
                                            if (Object.values(dish).length === 0) return <Fragment key={index} />;
                                            return (
                                                <div key={index} className="flex items-center gap-2 pr-2">
                                                    <div className="size-10 min-w-10 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                                                        <Image
                                                            src={dish?.filename}
                                                            alt={dish?.name}
                                                            width={200}
                                                            height={200}
                                                            sizes="100%"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                transformOrigin: 'center',
                                                                borderRadius: '8px 8px 0 0',
                                                            }}
                                                            priority
                                                        />
                                                    </div>
                                                    <h3 className="text-sm">{dish?.name}</h3>
                                                    <p className="ml-auto text-sm">{pesoFormatter.format(dish?.costperhead)} per guest served</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                
                                {Object.values(menu?.drinks || {}).length > 0 && (
                                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                                        <h3 className="font-headings text-sm font-semibold">Drinks</h3>
                                        {listOfDrinks?.map((drink, index) => {
                                            if (Object.values(drink).length === 0) return <Fragment key={index} />;
                                            return (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="size-10 min-w-10 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                                                        <Image
                                                            src={drink?.filename}
                                                            alt={drink?.name}
                                                            width={200}
                                                            height={200}
                                                            sizes="100%"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                transformOrigin: 'center',
                                                                borderRadius: '8px 8px 0 0',
                                                            }}
                                                            priority
                                                        />
                                                    </div>
                                                    <h3 className="text-sm">{drink?.name}</h3>
                                                    <p className="ml-auto text-sm">{pesoFormatter.format(drink?.costperhead)} per guest served</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col gap-2 py-2">
                        <h1 className="font-headings font-semibold text-lg">Date</h1>
                        <h2 className="font-headings font-bold text-2xl">{schedule?.date && schedule?.date}</h2>
                        {schedule?.time?.from && (
                            <div className="flex items-end font-semibold">
                                <span className="font-headings text-sm">From:&nbsp;&nbsp;</span>
                                <p className="font-paragraphs">{schedule?.time?.from}</p>
                            </div>
                        )}
                        {schedule?.time?.to && (
                            <div className="flex items-end font-semibold">
                                <span className="font-headings text-sm">To:&nbsp;&nbsp;</span>
                                <p className="font-paragraphs">{schedule?.time?.to}</p>
                            </div>
                        )}
                    </section>
                </main>
                {/* ------------------------------------Summarize-------------------------------- */}
                <aside className="md:fixed md:right-0 md:top-[calc(var(--nav-height)*2)] md:bottom-0 w-full md:w-1/4 flex flex-col gap-4 p-4 bg-gray-100 border-[1px] border-l-neutral-300">
                    <div className="flex flex-col gap-4">
                        {/* {
                            displaySummary && (
                                <article className="bg-white p-6 rounded-lg shadow-lg">
                                    <ul className="space-y-2">
                                        <li className="flex justify-between items-center">
                                            <h4 className="font-headings font-semibold text-[12px]">Venue Cost:</h4>
                                            <span className="font-paragraphs font-semibold text-[12px]">{pesoFormatter.format(venue?.price)}</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <h4 className="font-headings font-semibold text-[12px]">Cost per Guest for Dishes:</h4>
                                            <span className="font-paragraphs font-semibold text-[12px]">{pesoFormatter.format(listOfDishes.reduce((holder, dish) => holder + (dish?.costperhead || 0), 0))}</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <h4 className="font-headings font-semibold text-[12px]">Cost per Guest for Drinks:</h4>
                                            <span className="font-paragraphs font-semibold text-[12px]">{pesoFormatter.format(listOfDrinks.reduce((holder, drink) => holder + (drink?.costperhead || 0), 0))}</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <h4 className="font-headings font-semibold text-[12px]">Cost per Guest for Table & Chair Rental:</h4>
                                            <span className="font-paragraphs font-semibold text-[12px]">
                                                {pesoFormatter.format(venue?.tablesnchairsprovided ? 0 : costOfTablesNChairsPerGuest)}
                                            </span>
                                        </li>
                                    </ul>
                                    <small className="block text-neutral-500 mt-4 text-center">
                                        (Dishes Cost + Drinks Cost + Table & Chair Rental) x Number of Guests + Venue Cost
                                    </small>
                                </article>
                            )
                        }    */}

                        <div className="flex flex-col gap-2 text-xl">
                            <h3 className="font-headings">Total Payment: </h3>
                            <span className="font-paragraphs font-semibold">{pesoFormatter.format(totalPayment)}</span>
                        </div>
                        <p className="font-paragraphs text-sm bg-blue-500/40 text-blue-900 p-4 rounded-lg">
                            The cost is { costOfTablesNChairsPerGuest } pesos per guest for table and chair rental service.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {/* {
                            !displaySummary && <> */}
                                <label htmlFor="noofguest">Number of Guests</label>
                                <input
                                    inputMode="numeric"
                                    name="noofguest"
                                    defaultValue={noOfGuest}
                                    id="noofguest"
                                    className="input w-full border border-neutral-500/40"
                                    placeholder="Number of Guests"
                                    onChange={(ev) => guestNoInput(ev)}
                                />
                                <ErrorField message={invalidFieldsValue['noofguest']} />
                                <div className="flex gap-2">
                                    <button onClick={checkNoOfGuest} className="w-full button shadow-md border border-neutral-500/40 text-white">
                                        Confirm
                                    </button>
                                    <button onClick={() => router.push(`/`)} className="w-full button shadow-md border border-neutral-500/40 text-white">
                                        Cancel
                                    </button>
                                </div>
                            {/* </>
                        }

                        <button onClick={ () => setDisplaySummary(!displaySummary) } className="w-fit px-2 text-sm text-blue-800 mt-4">
                            View More Details
                        </button> */}
                    </div>
                    <ErrorField message={invalidFieldsValue['error']} />
                </aside>
            </div>
            {agreementPrompt && (
                <PromptAgreement
                    callback={agree}
                    onClose={() => setAgreementPrompt(false)}
                    deadline={dateFormatter.format(new Date(new Date(schedule?.date).getTime() + 1000 * 60 * 60 * 24))}
                />
            )}
            {reservationSuccess && (
                <SuccessModal
                    message="Congratulations on completing your reservation! If you have any further questions or need assistance with anything else, feel free to let us know. We're here to help make your event a success!"
                    callback={() => setReservationSuccess(false)}
                />
            )}
        </section>
    );    
};

export default ReviewBudget;
