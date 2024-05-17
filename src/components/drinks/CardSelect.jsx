'use client';
import Image from 'next/image';
import { CircleCheck, CirclePlus, CircleX } from '../icons/All';
import { useState, useEffect } from 'react';

const CardSelect = ({ drinkData, drinkMenu={}, setDrinkMenu=undefined }) => {
    const image = drinkData?.filename || '';
    const name = drinkData?.name || '';
    const description = drinkData?.description || '';
    const costPerHead = drinkData?.costperhead || 0;
    const status = drinkData?.status || 'available';

    const [ selected, setSelected ] = useState(false);

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const addDrink = () => {
        if(status === 'unavailable') return;
        if(!drinkData?._id) return;
        setDrinkMenu(state => ({ ...state, [drinkData._id]: drinkData }));
        setSelected(true);
    }

    const removeDrink = () => {
        if(status === 'unavailable') return;
        if(!drinkData?._id) return;
        setDrinkMenu(state => {
            delete state[drinkData._id];
            return state;
        });

        setSelected(false);
    }

    useEffect(() => {
        const { _id } = drinkData;
        if(_id) {
            setSelected(!!drinkMenu[_id]);
        }
    }, []);

    return (
        <div className={ `relative flex flex-col w-full h-[440px] rounded-lg shadow-xl border-[1px] hover:scale-[1.01] hover:shadow-2xl transition-transform hover:cursor-pointer` }>
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
            <article className="px-4 pt-2 pb-0 overflow-hidden min-h-[100px]">
                <h3 className="font-headings font-semibold">{ name }</h3>
                <p className="font-paragraphs text-sm line-clamp-5">{ description }</p>
            </article>
            <article className="w-full px-4 mt-auto pb-4 flex justify-between">
                <span className="text-sm text-neutral-600">{ pesoFormatter.format(costPerHead) } per guest served</span>
                <span className={ `max-h-[22px] text-sm rounded-full px-1 border-[1px] ${ status === 'available' ? 'bg-green-200/40 text-green-500 border-green-500/40' : 'bg-red-200/40 text-red-500 border-red-500/40' }` }>{ status }</span>
            </article>
            {
                status === 'unavailable' ?
                    <div className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg hover:bg-red-900 opacity-90 border-2 border-red-600 shadow-lg hover:shadow-red-600 flex justify-center items-center">
                        <CircleX size={ 90 } className="stroke-transparent group-hover:stroke-white -mt-[120px]" />
                        <h1 className="absolute font-headings text-transparent group-hover:text-white font-bold text-2xl">UNAVAILABLE</h1>
                    </div>
                :
                    <div onClick={ addDrink } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg hover:bg-green-900 opacity-90 border-2 border-green-600 shadow-lg hover:shadow-green-600 flex justify-center items-center">
                        <CirclePlus size={ 90 } className="stroke-transparent group-hover:stroke-white -mt-[120px]" />
                        <h1 className="absolute font-headings text-transparent group-hover:text-white font-bold text-2xl">SELECT DRINK</h1>
                    </div>
            }

            {
                selected && 
                    <div onClick={ removeDrink } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg bg-green-900 opacity-90 border-2 border-green-600 shadow-lg shadow-green-600 flex flex-col justify-center items-center">
                        <CircleCheck size={ 90 } className="stroke-white -mt-[120px]" />
                        <p className="font-paragraphs text-white">{ name }</p>
                        <h1 className="font-headings text-white font-bold text-2xl">ADDED</h1>
                    </div>
            }
        </div>
    );
}

export default CardSelect;