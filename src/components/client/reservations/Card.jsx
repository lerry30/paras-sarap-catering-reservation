import { useEffect, useState, Fragment } from 'react';
import Image from 'next/image';
import TitleFormat from '@/utils/titleFormat';

const Card = ({ reservationData = {}, rejectionReason = '' }) => {
    const event = TitleFormat(reservationData?.event);

    // Venue details
    const venueName = reservationData?.venue?.name || '';
    const venueDescription = reservationData?.venue?.description || '';
    const maximumSeatingCapacity = reservationData?.venue?.maximumSeatingCapacity || '';
    const venueFileName = reservationData?.venue?.filename || '';
    const venuePrice = reservationData?.venue?.price || 0;
    const street = reservationData?.venue?.address?.street || '';
    const barangay = reservationData?.venue?.address?.barangay || '';
    const municipality = reservationData?.venue?.address?.municipality || '';
    const province = reservationData?.venue?.address?.province || '';
    const fullAddress = `${street}, ${barangay}, ${municipality}, ${province}`;

    // Menu details
    const menuName = reservationData?.menu?.name || '';
    const menuDescription = reservationData?.menu?.description || '';
    const listOfDishes = reservationData?.menu?.listofdishes || [];
    const listOfDrinks = reservationData?.menu?.listofdrinks || [];

    // Date and time
    const day = reservationData?.date?.day || '';
    const timeFrom = reservationData?.date?.time?.from || '';
    const timeTo = reservationData?.date?.time?.to || '';

    const noOfGuest = reservationData?.noofguest || 0;
    const status = reservationData?.status || 'pending';
    const reservedAt = reservationData?.createdAt || '';

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
    const dateFormatter = new Intl.DateTimeFormat('en-PH', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const totalPriceOfDishesPerServed = listOfDishes.reduce((initVal, dish) => initVal + dish.costperhead, 0);
        const totalPriceOfDrinksPerServed = listOfDrinks.reduce((initVal, drink) => initVal + drink.costperhead, 0);

        const totalAmount = (totalPriceOfDishesPerServed + totalPriceOfDrinksPerServed + 20) * noOfGuest + venuePrice;
        setTotal(totalAmount);
    }, []);

    return (
        <main className="w-full rounded-lg shadow-lg border border-gray-300 divide-y mb-6 overflow-hidden">
            <section className="h-14 flex items-center justify-between bg-gray-800 px-4 text-sm">
                <h2 className="font-headings text-white font-semibold">{event}</h2>
                <div className="flex font-paragraphs text-white">
                    <h2 className="font-semibold">Reserved At:&nbsp;&nbsp;</h2>
                    <span>{dateFormatter.format(new Date(reservedAt))}</span>
                </div>
            </section>
            <section className="p-6 bg-gray-50">
                <h1 className="font-headings font-semibold text-xl mb-2">Venue</h1>
                <div className="flex gap-6">
                    {venueFileName && (
                        <div className="w-40 h-40">
                            <Image
                                src={venueFileName}
                                alt={venueName || ''}
                                width={200}
                                height={200}
                                sizes="100%"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                                priority
                            />
                        </div>
                    )}
                    <div>
                        <h2 className="font-headings font-semibold text-lg">{venueName}</h2>
                        <p className="font-paragraphs text-gray-600 text-sm mb-2">{venueDescription}</p>
                        <h3 className="font-paragraphs italic text-md font-semibold">{fullAddress}</h3>
                        {maximumSeatingCapacity && (
                            <article className="mt-2">
                                <span className="font-headings text-sm">Maximum Seating Capacity:&nbsp;</span>
                                <span className="font-paragraphs font-semibold">{maximumSeatingCapacity}</span>
                            </article>
                        )}
                        {venuePrice && (
                            <article className="mt-2">
                                <span className="font-headings text-sm">Price:&nbsp;</span>
                                <span className="font-paragraphs font-semibold">{pesoFormatter.format(venuePrice)}</span>
                            </article>
                        )}
                    </div>
                </div>
            </section>
            <section className="p-6 bg-white">
                <h1 className="font-headings font-semibold text-xl mb-2">Menu</h1>
                <div className="flex flex-col">
                    <h2 className="font-headings font-semibold text-lg">{menuName}</h2>
                    <p className="font-paragraphs text-gray-600 text-sm mb-4">{menuDescription}</p>
                    <div className="flex flex-col md:flex-row justify-around gap-8">
                        {listOfDishes.length > 0 && (
                            <div className="w-full md:w-1/2 flex flex-col gap-4">
                                <h3 className="font-headings text-sm font-semibold">Dishes</h3>
                                {listOfDishes.map((dish, index) => {
                                    if (Object.values(dish).length === 0) return <Fragment key={index} />;
                                    return (
                                        <div key={index} className="flex items-center gap-2 pr-2">
                                            <div className="w-10 h-10 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-gray-300 relative">
                                                <Image
                                                    src={dish?.filename}
                                                    alt={dish?.name}
                                                    width={40}
                                                    height={40}
                                                    sizes="100%"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
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
                        {listOfDrinks.length > 0 && (
                            <div className="w-full md:w-1/2 flex flex-col gap-4">
                                <h3 className="font-headings text-sm font-semibold">Drinks</h3>
                                {listOfDrinks.map((drink, index) => {
                                    if (Object.values(drink).length === 0) return <Fragment key={index} />;
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-10 h-10 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-gray-300 relative">
                                                <Image
                                                    src={drink?.filename}
                                                    alt={drink?.name}
                                                    width={40}
                                                    height={40}
                                                    sizes="100%"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
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
            <section className="p-6 bg-gray-50">
                <h1 className="font-headings font-semibold text-xl mb-2">Date</h1>
                <h2 className="font-headings font-bold text-2xl">{day}</h2>
                {timeFrom && (
                    <div className="flex items-end font-semibold">
                        <span className="font-headings text-sm">From:&nbsp;&nbsp;</span>
                        <p className="font-paragraphs">{timeFrom}</p>
                    </div>
                )}
                {timeTo && (
                    <div className="flex items-end font-semibold">
                        <span className="font-headings text-sm">To:&nbsp;&nbsp;</span>
                        <p className="font-paragraphs">{timeTo}</p>
                    </div>
                )}
            </section>
            <section className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <article className="font-paragraphs text-sm flex gap-2">
                            <span>Number of Guest:</span>
                            <span className="font-semibold">{noOfGuest}</span>
                        </article>
                        <article className="font-paragraphs flex gap-2">
                            <span className="text-lg">Total Price:</span>
                            <span className="font-semibold text-lg">{pesoFormatter.format(total)}</span>
                        </article>
                    </div>
                    <article className="font-headings font-semibold flex gap-2 items-center">
                        <span>Status: </span>
                        <span
                            className={`text-sm rounded-full px-2 py-1 ${status === 'pending' ? 'bg-yellow-300' : status === 'approved' ? 'bg-green-300' : 'bg-red-300'} text-neutral-700 leading-normal`}
                        >
                            {status}
                        </span>
                    </article>
                </div>
            </section>
            {rejectionReason && (
                <section className="p-6 bg-gray-50">
                    <h1 className="font-headings font-semibold text-lg text-red-500">Rejection Reason</h1>
                    <p className="font-paragraphs text-red-500">{rejectionReason}</p>
                </section>
            )}
        </main>
    );
};

export default Card;
