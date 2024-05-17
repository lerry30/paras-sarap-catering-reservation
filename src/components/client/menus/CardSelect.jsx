'use client';
import Image from 'next/image';
import { CircleCheck, CirclePlus, CircleX } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { zReservation } from '@/stores/reservation';

const CardSelect = ({ menuData, index, allSelects, setAllSelects }) => {
    const name = menuData?.name || '';
    const description = menuData?.description || '';
    const status = menuData?.status || 'available';
    
    const [ listOfDishes, setListOfDishes ] = useState([]);
    const [ listOfDrinks, setListOfDrinks ] = useState([]);

    const saveMenuData = zReservation(state => state.saveMenuData);
    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const addMenu = () => {
        if(status === 'unavailable') return;
        if(!menuData?._k) return;
        saveMenuData(menuData);

        setAllSelects(select => select.map((item, i) => (i===index)));
    }
    
    const removeMenu = () => {
        if(status === 'unavailable') return;
        if(!menuData?._k) return;
        saveMenuData({});

        setAllSelects(select => select.map(item => false));
    }

    useEffect(() => {
        setListOfDishes(Object.values(menuData?.dishes || []));
        setListOfDrinks(Object.values(menuData?.drinks || []));
        // setStatus(menuData?.status);
    }, []);

    return (
        <div className="relative flex flex-col w-full pt-4 pb-8 rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
            <article className="px-4 py-2 overflow-hidden">
                <div className="flex items-center gap-2">
                    <h3 className="font-headings font-semibold">{ name }</h3>
                    <span className={ `max-h-[18px] text-sm rounded-full px-1 border-[1px] leading-none ${ status === 'available' ? 'bg-green-200/40 text-green-700 border-green-500/40' : 'bg-red-200/40 text-red-700 border-red-500/40' }` }>{ status }</span>
                </div>
                <p className="font-paragraphs text-sm">{ description }</p>
            </article>
            <div className="w-full flex flex-col md:flex-row justify-around px-4 gap-4 md:gap-0">
                <div className="w-1/2 flex flex-col gap-1">
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
                                    <p className="mx-auto text-sm">{ pesoFormatter.format(dish?.costperhead) } per guest served</p>
                                    <span className={ `text-sm rounded-full px-1 border-[1px] ml-auto leading-none ${ dish?.status === 'available' ? 'bg-green-200/40 text-green-700 border-green-500/40' : 'bg-red-200/40 text-red-700 border-red-500/40' }` }>{ dish.status }</span>
                                </div>
                            }
                        )
                    }
                </div>

                <div className="w-1/2 flex flex-col gap-1">
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
                                    <p className="mx-auto text-sm">{ pesoFormatter.format(drink?.costperhead) } per guest served</p>
                                    <span className={ `text-sm rounded-full px-1 border-[1px] ml-auto leading-none ${ drink?.status === 'available' ? 'bg-green-200/40 text-green-700 border-green-500/40' : 'bg-red-200/40 text-red-700 border-red-500/40' }` }>{ drink?.status }</span>
                                </div>
                            }
                        )
                    }
                </div>
            </div>
            {
                status === 'unavailable' ?
                    <div className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg hover:bg-red-900 opacity-90 border-2 border-red-600 shadow-lg hover:shadow-red-600 flex justify-center items-center">
                        <CircleX size={ 90 } className="stroke-transparent group-hover:stroke-white -mt-[120px]" />
                        <h1 className="absolute font-headings text-transparent group-hover:text-white font-bold text-2xl">UNAVAILABLE</h1>
                    </div>
                :
                    <div onClick={ addMenu } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg hover:bg-green-900 opacity-90 border-2 border-green-600 shadow-lg hover:shadow-green-600 flex justify-center items-center hover:cursor-pointer">
                        <CirclePlus size={ 90 } className="stroke-transparent group-hover:stroke-white -mt-[60px]" />
                        <h1 className="absolute font-headings text-transparent group-hover:text-white font-bold text-2xl mt-[60px]">SELECT MENU</h1>
                    </div>
            }

            {
                allSelects[index] && 
                    <div onClick={ removeMenu } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg bg-green-900 opacity-90 border-2 border-green-600 shadow-lg shadow-green-600 flex flex-col justify-center items-center px-8 hover:cursor-pointer">
                        <CircleCheck size={ 90 } className="stroke-white -mt-[40px]" />
                        <p className="font-paragraphs text-white">{ name }</p>
                        <h1 className="font-headings text-white font-bold text-2xl text-center">SELECTED AS YOUR MENU</h1>
                    </div>
            }
        </div>
    );
}

export default CardSelect;
// w-[calc((100vw-var(--admin-sidebar-width)-(16px*5))/4)]