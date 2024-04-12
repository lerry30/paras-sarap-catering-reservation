'use client';
import Image from 'next/image';
import { Pen, Trash } from '@/components/icons/All';
import { Fragment } from 'react';

const Card = ({ menuData, onDelete, onUpdate, viewMore }) => {
    const name = menuData?.name || '';
    const description = menuData?.description || '';

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    return (
        <div className="flex flex-col w-full rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
            <article className="px-4 py-2 overflow-hidden">
                <h3 className="font-headings font-semibold">{ name }</h3>
                <p className="font-paragraphs text-sm">{ description }</p>
            </article>
            <div className="w-full flex justify-around px-4">
                <div className="w-1/2 flex flex-col gap-1">
                    <h3 className="font-headings text-sm font-semibold">Dishes</h3>
                    {
                        menuData?.dishes?.map((dish, index) => {
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
                        menuData?.drinks?.map((drink, index) => {
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
            <div className="flex gap-2 justify-end px-4 pb-6 mt-auto">
                <button onClick={ () => viewMore(menuData?._k) } className="rounded-full bg-neutral-500/40 font-medium py-1 px-2 cursor-pointer text-sm hover:bg-neutral-400 transition-colors">See Details</button>
                <button onClick={ () => onUpdate(menuData?._k) } className="group relative rounded-full bg-blue-600/40 p-1 cursor-pointer hover:bg-blue-400 transition-colors"><Pen size={20} stroke="#00f9" />
                    <div className="absolute top-full mt-2 bg-neutral-700 px-2 py-1 rounded-md text-white hidden group-hover:flex">
                        <span className="text-sm">Edit</span>
                        <div className="size-2 absolute top-0 -mt-[2px] z-0 rotate-45 bg-neutral-700"></div>
                    </div>
                </button>
                <button onClick={ () => onDelete(menuData?._k) } className="group relative rounded-full bg-red-600/40 p-1 cursor-pointer hover:bg-red-400 transition-colors"><Trash size={20} stroke="#f009" />
                    <div className="absolute top-full mt-2 bg-neutral-700 px-2 py-1 rounded-md text-white hidden group-hover:flex">
                        <span className="text-sm">Remove</span>
                        <div className="size-2 absolute top-0 -mt-[2px] z-0 rotate-45 bg-neutral-700"></div>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Card;