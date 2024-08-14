'use client';
import Image from 'next/image';
import { CircleCheck } from '@/components/icons/All';
import { HoverAvailable, HoverUnavailable } from '@/components/HoverCard';
import { useEffect, useState } from 'react';
import { zReservation } from '@/stores/reservation';

const CardSelect = ({ themeData, index, allSelects, setAllSelects }) => {
    const image = themeData?.filename || '';
    const name = themeData?.name || '';
    const description = themeData?.description || '';

    const saveThemeData = zReservation(state => state.saveThemeData);

    const addTheme = () => {
        if(!themeData?._k) return;
        saveThemeData(themeData);

        setAllSelects(select => select.map((item, i) => (i===index)));
    }
    
    const removeTheme = () => {
        if(!themeData?._k) return;
        saveThemeData({});

        setAllSelects(select => select.map(item => false));
    }

    return (
        <div className="relative flex flex-col w-full min-w-[300px] max-w-[calc((100vw-(var(--page-x-padding)*2))/3-20px)] h-[440px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition duration-500 ease-in-out">
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
            <HoverAvailable onClick={ addTheme } text="SELECT VENUE" />
            {
                allSelects[index] && 
                    <div onClick={ removeTheme } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg bg-green-900 opacity-90 border-2 border-green-600 shadow-lg shadow-green-600 flex flex-col justify-center items-center px-8">
                        <CircleCheck size={ 90 } className="stroke-white -mt-[120px]" />
                        <p className="font-paragraphs text-white">{ name }</p>
                        <h1 className="font-headings text-white font-bold text-2xl text-center">SELECTED AS YOUR VENUE</h1>
                    </div>
            }
        </div>
    );
}

export default CardSelect;
// w-[calc((100vw-var(--admin-sidebar-width)-(16px*5))/4)]
