'use client';
import Image from 'next/image';
import { CircleCheck, CirclePlus, CircleX } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { zReservation } from '@/stores/reservation';

const CardSelect = ({ venueData, index, allSelects, setAllSelects }) => {
    const image = venueData?.filename || '';
    const name = venueData?.name || '';
    const description = venueData?.description || '';
    const address = venueData?.address || {};
    const maximumSeatingCapacity = venueData?.maximumSeatingCapacity || 0;
    const price = venueData?.price || 0;
    const chargesForTablesAndChairs = venueData?.chargesForTablesAndChairs || 0;
    const status = venueData?.status || 'available';
    const [ fullAddress, setFullAddress ] = useState('');

    const saveVenueData = zReservation(state => state.saveVenueData);
    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const addVenue = () => {
        if(status === 'unavailable') return;
        if(!venueData?._k) return;
        saveVenueData(venueData);

        setAllSelects(select => select.map((item, i) => (i===index)));
    }
    
    const removeVenue = () => {
        if(status === 'unavailable') return;
        if(!venueData?._k) return;
        saveVenueData({});

        setAllSelects(select => select.map(item => false));
    }
    
    useEffect(() => {
        const fAddress = `${ address?.street }, Brgy. ${ address?.barangay }, ${ address?.municipality }, ${ address?.province }`;
        setFullAddress(fAddress);
    }, []);

    return (
        <div className="relative flex flex-col w-full min-w-[340px] max-w-[calc((100vw-(var(--page-x-padding)*2))/3-16px)] h-[410px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
            <Image 
                src={ image }
                alt={ name }
                width={ 200 }
                height={ 200 }
                sizes='100%'
                style={{
                    width: '100%',
                    height: '44%',
                    objectFit: 'cover',
                    transformOrigin: 'center',
                    borderRadius: '8px 8px 0 0',
                    minHeight: '170px',
                    maxHeight: '170px',
                }}
                priority
            />
            <article className="px-4 pt-2 pb-0 min-h-[70px] overflow-hidden">
                <h3 className="font-headings font-semibold line-clamp-1">{ name }</h3>
                <p className={ `font-paragraphs text-sm line-clamp-2 }` }>{ description }</p>
            </article>
            <article className="w-full px-4 py-2 mt-auto">
                <span className="font-semibold italic text-neutral-600 line-clamp-2">{ fullAddress }</span>
            </article>
            <article className="w-full flex flex-col justify-between px-4 mt-auto pb-2">
                <span className="text-neutral-600 text-sm">Maximum Seating Capacity: { maximumSeatingCapacity }</span>
                <span className="text-neutral-600 text-sm">From: { pesoFormatter.format(price) }</span>
                <span className="text-neutral-600 text-sm">Additional Charges for Tables and Chairs: { pesoFormatter.format(chargesForTablesAndChairs) }</span>
            </article>
            <div className="flex justify-between items-center px-4 pb-4 mt-auto">
                <span className={ `text-sm rounded-full px-1 ${ status === 'available' ? 'bg-green-200/40 text-green-500' : 'bg-red-200/40 text-red-500' }` }>{ status }</span>
            </div>
            {
                status === 'unavailable' ?
                    <div className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg hover:bg-red-900 opacity-90 border-2 border-red-600 shadow-lg hover:shadow-red-600 flex justify-center items-center">
                        <CircleX size={ 90 } className="stroke-transparent group-hover:stroke-white -mt-[120px]" />
                        <h1 className="absolute font-headings text-transparent group-hover:text-white font-bold text-2xl">UNAVAILABLE</h1>
                    </div>
                :
                    <div onClick={ addVenue } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg hover:bg-green-900 opacity-90 border-2 border-green-600 shadow-lg hover:shadow-green-600 flex justify-center items-center">
                        <CirclePlus size={ 90 } className="stroke-transparent group-hover:stroke-white -mt-[120px]" />
                        <h1 className="absolute font-headings text-transparent group-hover:text-white font-bold text-2xl">SELECT VENUE</h1>
                    </div>
            }

            {
                allSelects[index] && 
                    <div onClick={ removeVenue } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg bg-green-900 opacity-90 border-2 border-green-600 shadow-lg shadow-green-600 flex flex-col justify-center items-center">
                        <CircleCheck size={ 90 } className="stroke-white -mt-[120px]" />
                        <p className="font-paragraphs text-white">{ name }</p>
                        <h1 className="font-headings text-white font-bold text-2xl">ADDED</h1>
                    </div>
            }
        </div>
    );
}

export default CardSelect;
// w-[calc((100vw-var(--admin-sidebar-width)-(16px*5))/4)]