import { createFullname } from '@/utils/name';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProfileImage from '@/components/ProfileImage';

const Card = ({ reservationData={}, changeReservationStatus, tab='pending' }) => {
    const id = reservationData?._id;
    // user
    const firstName = reservationData?.user?.firstname || '';
    const lastName = reservationData?.user?.lastname || '';
    const email = reservationData?.user?.email || '';
    const userFileName = reservationData?.user?.filename || '';

    // venue
    const venueName = reservationData?.venue?.name || '';
    const venueDescription = reservationData?.venue?.description || '';
    const maximumSeatingCapacity = reservationData?.venue?.maximumSeatingCapacity || '';
    const venueFileName = reservationData?.venue?.filename || '';
    const venuePrice = reservationData?.venue?.price || 0;
    const street = reservationData?.venue?.address?.street || '';
    const barangay = reservationData?.venue?.address?.barangay || '';
    const municipality = reservationData?.venue?.address?.municipality || '';
    const province = reservationData?.venue?.address?.province || '';
    const fullAddress = `${ street }, ${ barangay }, ${ municipality }, ${ province }`;

    // menu
    const menuName = reservationData?.menu?.name || '';
    const menuDescription = reservationData?.menu?.description || '';
    const listOfDishes = reservationData?.menu?.listofdishes || [];
    const listOfDrinks = reservationData?.menu?.listofdrinks || [];

    // date
    const day = reservationData?.date?.day || '';
    const timeFrom = reservationData?.date?.time?.from || '';
    const timeTo = reservationData?.date?.time?.to || '';

    const noOfGuest = reservationData?.noofguest || 0;
    const status = reservationData?.status || 'pending';
    const reservedAt = reservationData?.createdAt || '';

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
    const dateFormatter = new Intl.DateTimeFormat('en-PH', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,});

    // const statusSkin = { pending: 'bg-orange-400 text-orange-800 border-orange-700', approved: 'bg-teal-400 text-teal-800 border-teal-700', rejected: 'bg-red-400 text-red-800 border-red-700' };

    const [ total, setTotal ] = useState(0);

    useEffect(() => {
        const totalPriceOfDishesPerServed = listOfDishes.reduce((initVal, dish) => (initVal + dish.costperhead), 0);
        const totalPriceOfDrinksPerServed = listOfDrinks.reduce((initVal, drink) => (initVal + drink.costperhead), 0);

        const totalAmout = (totalPriceOfDishesPerServed + totalPriceOfDrinksPerServed + 20) * noOfGuest + venuePrice;
        setTotal(totalAmout);
    }, []);

    return <main className="w-full p-6 rounded-lg shadow-xl border-2 divide-y-[1px] mb-6">
        <section className="flex items-center gap-2 pb-2">
            <ProfileImage image={ userFileName } size={ 64 } className="size-[64px]" />
            <div>
                <h3 className="font-headings font-semibold text-lg">{ createFullname(firstName, lastName) }</h3>
                <span className="font-paragraphs italic">{ email }</span>
            </div>
            <div className="flex ml-auto gap-2 font-paragraphs">
                <h2 className="font-semibold text-sm text-neutral-500">Reserved At:</h2>
                <span className="text-sm text-neutral-500">{ dateFormatter.format(new Date(reservedAt)) }</span>
            </div>
        </section>
        <section>
            {/* themes */}
        </section>
        <section className="flex flex-col gap-1 py-2">
            <h1 className="font-headings font-semibold text-lg">Venue</h1>
            <div className="flex flex-col md:flex-row gap-6">
                {
                    venueFileName && 
                        <div className="w-[150px] aspect-square">
                            <Image 
                                src={ venueFileName }
                                alt={ venueName || '' }
                                width={ 200 }
                                height={ 200 }
                                sizes='100%'
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
                }
                <div>
                    <h2 className="font-headings font-semibold">{ venueName }</h2>
                    <p className="font-paragraphs text-neutral-500 text-sm">{ venueDescription }</p>
                    <h3 className="font-paragraphs italic text-lg font-semibold">{ fullAddress }</h3>
                    {
                        maximumSeatingCapacity && <article>
                                <span className="font-headings text-sm">Maximum Seating Capacity:&nbsp;</span>
                                <span className="font-paragraphs font-semibold">{ maximumSeatingCapacity }</span>
                            </article>
                    }

                    {
                        venuePrice && <article>
                                <span className="font-headings text-sm">Price:&nbsp;</span>
                                <span className="font-paragraphs font-semibold">{ pesoFormatter.format(venuePrice) }</span>
                            </article>
                    }
                </div>
            </div>
        </section>
        <section className="flex flex-col gap-1 py-2">
            <h1 className="font-headings font-semibold text-lg">Menu</h1>
            <div className="flex flex-col">
                <h2 className="font-headings font-semibold">{ menuName }</h2>
                <p className="font-paragraphs text-neutral-500 text-sm">{ menuDescription }</p>
                <div className="w-full flex flex-col md:flex-row justify-around gap-8 py-4">
                    {
                        listOfDishes.length > 0 &&
                            <div className="w-full md:w-1/2 flex flex-col gap-4">
                                <h3 className="font-headings text-sm font-semibold">Dishes</h3>
                                {
                                    listOfDishes?.map((dish, index) => {
                                        if(Object.values(dish).length === 0) return <Fragment key={ index } />
                                        return <div key={ index } className="flex items-center gap-2 pr-2">
                                                <div className="size-10 min-w-10 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                                                    <Image 
                                                        src={ dish?.filename }
                                                        alt={ dish?.name }
                                                        width={ 200 }
                                                        height={ 200 }
                                                        sizes='100%'
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
                                                <h3 className="text-sm">{ dish?.name }</h3>
                                                <p className="ml-auto text-sm">{ pesoFormatter.format(dish?.costperhead) } per guest served</p>
                                            </div>
                                        }
                                    )
                                }
                            </div>
                    }

                    {
                        listOfDrinks.length > 0 &&
                            <div className="w-full md:w-1/2 flex flex-col gap-4">
                                <h3 className="font-headings text-sm font-semibold">Drinks</h3>
                                {
                                    listOfDrinks?.map((drink, index) => {
                                        if(Object.values(drink).length === 0) return <Fragment key={ index } />
                                        return <div key={ index } className="flex items-center gap-2">
                                                <div className="size-10 min-w-10 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                                                    <Image 
                                                        src={ drink?.filename }
                                                        alt={ drink?.name }
                                                        width={ 200 }
                                                        height={ 200 }
                                                        sizes='100%'
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
                                                <h3 className="text-sm">{ drink?.name }</h3>
                                                <p className="ml-auto text-sm">{ pesoFormatter.format(drink?.costperhead) } per guest served</p>
                                            </div>
                                        }
                                    )
                                }
                            </div>
                    }
                </div>
            </div>
        </section>
        <section className="flex flex-col py-2">
            <h1 className="font-headings font-semibold text-lg">Date</h1>

            <h2 className="font-headings font-bold text-2xl">{ day }</h2>
            { 
                timeFrom && 
                    <div className="flex items-end font-semibold">
                        <span className="font-headings text-sm">From:&nbsp;&nbsp;</span>
                        <p className="font-paragraphs">{ timeFrom }</p>
                    </div>
            }
            { 
                timeTo && 
                    <div className="flex items-end font-semibold">
                        <span className="font-headings text-sm">To:&nbsp;&nbsp;</span>
                        <p className="font-paragraphs">{ timeTo }</p>
                    </div>
            }
        </section>
        <section className="flex items-center justify-between py-2">
            <div className="flex flex-col">
                <article className="font-paragraphs text-sm flex gap-2">
                    <span>Number of Guest:</span>
                    <span className="font-semibold">{ noOfGuest }</span>
                </article>
                <article className="font-paragraphs flex gap-2">
                    <span className="text-lg">Total of Price:</span>
                    <span className="font-semibold text-lg">{ pesoFormatter.format(total) }</span>
                </article>
            </div>
            <article className="font-headings font-semibold flex gap-2">
                <span>Status: </span>
                <span className={ `text-sm rounded-full border-[1px] px-2 text-neutral-700 leading-normal` }>{ status }</span>
            </article>
            <div className="font-headings flex gap-4">
                {
                    (tab === 'pending' || tab === 'rejected') &&
                        <button onClick={ () => changeReservationStatus(id, 'approved') } className="bg-skin-ten text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-800 leading-normal">APPROVE</button>
                }

                {
                    (tab === 'pending' || tab === 'approved') &&
                        <button onClick={ () => changeReservationStatus(id, 'rejected') } className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-800 leading-normal">REJECT</button>
                }
            </div>
        </section>
    </main>
}

export default Card;

// ${ statusSkin[status] }
