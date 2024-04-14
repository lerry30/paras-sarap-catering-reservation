'use client';
import Image from 'next/image';
import { Pen, Trash } from '@/components/icons/All';

const Card = ({ drinkData, onDelete, onUpdate, viewMore }) => {
    const image = drinkData?.filename || '';
    const name = drinkData?.name || '';
    const description = drinkData?.description || '';
    const costPerHead = drinkData?.costperhead || 0;
    const status = drinkData?.status || 'available';

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    return (
        <div className="flex flex-col w-full max-w-[258px] h-[380px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
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
                <p className="font-paragraphs text-sm line-clamp-3">{ description }</p>
            </article>
            <article className="w-full px-4 mt-auto pb-2 flex justify-between">
                <span className="text-sm text-neutral-600">{ pesoFormatter.format(costPerHead) } per guest served</span>
                <span className={ `text-sm rounded-full px-1 ${ status === 'available' ? 'bg-green-200/40 text-green-500' : 'bg-red-200/40 text-red-500' }` }>{ status }</span>
            </article>
            <div className="flex gap-2 justify-end px-4 pb-6 mt-auto">
                <button onClick={ () => viewMore(drinkData?._k) } className="rounded-full bg-neutral-500/40 font-medium py-1 px-2 cursor-pointer text-sm hover:bg-neutral-400 transition-colors">See Details</button>
                <button onClick={ () => onUpdate(drinkData?._k) } className="group relative rounded-full bg-blue-600/40 p-1 cursor-pointer hover:bg-blue-400 transition-colors"><Pen size={20} stroke="#00f9" />
                    <div className="absolute top-full mt-2 bg-neutral-700 px-2 py-1 rounded-md text-white hidden group-hover:flex">
                        <span className="text-sm">Edit</span>
                        <div className="size-2 absolute top-0 -mt-[2px] z-0 rotate-45 bg-neutral-700"></div>
                    </div>
                </button>
                <button onClick={ () => onDelete(drinkData?._k) } className="group relative rounded-full bg-red-600/40 p-1 cursor-pointer hover:bg-red-400 transition-colors"><Trash size={20} stroke="#f009" />
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
// w-[calc((100vw-var(--admin-sidebar-width)-(16px*5))/4)]


// They’re made with a delicious vegetable and tofu filling then rolled in authentic lumpia wrappers
// Indulge in our tantalizing pork BBQ, meticulously crafted with succulent cuts of premium pork, expertly marinated in our signature blend of handpicked spices and secret ingredients. But what truly sets our BBQ apart is our meticulously curated special sweetened sauce. Every mouthwatering bite bursts with a symphony of flavors, as the tender pork harmonizes perfectly with the rich, tangy sweetness of our sauce. From the first savory bite to the last lingering taste, experience a culinary journey like no other, where each bite is an unforgettable delight. Elevate your BBQ experience with our unparalleled fusion of flavors, guaranteed to tantalize your taste buds and leave you craving more.

// Model.deleteMany()
// Model.deleteOne()
// Model.find()
// Model.findById()
// Model.findByIdAndDelete()
// Model.findByIdAndRemove()
// Model.findByIdAndUpdate()
// Model.findOne()
// Model.findOneAndDelete()
// Model.findOneAndReplace()
// Model.findOneAndUpdate()
// Model.replaceOne()
// Model.updateMany()
// Model.updateOne()

// https://www.youtube.com/watch?v=lHQUkWcp8xU&pp=ygUObGUgbGEgbGUgbGEgbGU%3D