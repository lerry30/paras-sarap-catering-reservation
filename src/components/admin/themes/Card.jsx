'use client';
import Image from 'next/image';
import { Pen, Trash } from '@/components/icons/All';
import { useEffect, useState } from 'react';

const Card = ({ themeData, onDelete, onUpdate, viewMore }) => {
    const image = themeData?.filename || '';
    const name = themeData?.name || '';
    const description = themeData?.description || '';

    return (
        <div className="flex flex-col w-full min-w-[370px] max-w-[calc((100vw-var(--admin-sidebar-width)-(18px*4))/2)] h-[370px] rounded-lg shadow-xl border-[1px] hover:scale-[1.01] hover:shadow-2xl transition-transform bg-white">
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
            <article className="px-4 pt-2 pb-0 overflow-hidden">
                <h3 className="font-headings font-semibold line-clamp-1">{ name }</h3>
                <p className={ `font-paragraphs text-sm line-clamp-2 }` }>{ description }</p>
            </article>
            <div className="flex justify-end items-center px-4 pb-6 mt-auto">
                <div className="flex gap-2">
                    <button onClick={ () => viewMore(themeData?._k) } className="rounded-full bg-neutral-500/40 font-medium py-1 px-2 cursor-pointer text-sm hover:bg-neutral-400 transition-colors">See Details</button>
                    <button onClick={ () => onUpdate(themeData?._k) } className="group relative rounded-full bg-blue-600/40 p-1 cursor-pointer hover:bg-blue-400 transition-colors"><Pen size={20} stroke="#00f9" />
                        <div className="absolute top-full mt-2 bg-neutral-700 px-2 py-1 rounded-md text-white hidden group-hover:flex">
                            <span className="text-sm">Edit</span>
                            <div className="size-2 absolute top-0 -mt-[2px] z-0 rotate-45 bg-neutral-700"></div>
                        </div>
                    </button>
                    <button onClick={ () => onDelete(themeData?._k) } className="group relative rounded-full bg-red-600/40 p-1 cursor-pointer hover:bg-red-400 transition-colors"><Trash size={20} stroke="#f009" />
                        <div className="absolute top-full mt-2 bg-neutral-700 px-2 py-1 rounded-md text-white hidden group-hover:flex">
                            <span className="text-sm">Remove</span>
                            <div className="size-2 absolute top-0 -mt-[2px] z-0 rotate-45 bg-neutral-700"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
// w-[calc((100vw-var(--admin-sidebar-width)-(16px*5))/4)]
