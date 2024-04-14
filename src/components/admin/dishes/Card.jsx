'use client';
import Image from 'next/image';
import { Pen, Trash } from '@/components/icons/All';

const Card = ({ dishData, onDelete, onUpdate, viewMore }) => {
    const image = dishData?.filename || '';
    const name = dishData?.name || '';
    const description = dishData?.description || '';
    const allergens = dishData?.allergens || [];
    // const allergens = [];
    const costPerHead = dishData?.costperhead || 0;
    const status = dishData?.status || 'available';

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    return (
        <div className="flex flex-col w-full max-w-[258px] h-[440px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
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
                <p className={ `font-paragraphs text-sm line-clamp-3 ${ allergens.length === 0 && 'line-clamp-6' }` }>{ description }</p>
            </article>
            {
                allergens.length > 0 &&
                    <article className="flex flex-col gap-1 px-4 pt-2 pb-0 font-semibold">
                        <h6 className="font-headings text-sm">Allergic Food Components</h6>
                        <div className="min-h-[60px] flex flex-wrap gap-1">
                            {
                                allergens.map((item, index) => (
                                    <span key={ index } className="size-fit p-1 rounded-full bg-yellow-500/20 text-yellow-900 text-[12px]">{ item }</span>
                                ))
                            }
                        </div>
                    </article>
            }
            <article className="w-full px-4 mt-auto pb-2 flex justify-between">
                <span className="text-sm text-neutral-600">{ pesoFormatter.format(costPerHead) } per guest served</span>
                <span className={ `text-sm rounded-full px-1 ${ status === 'available' ? 'bg-green-200/40 text-green-500' : 'bg-red-200/40 text-red-500' }` }>{ status }</span>
            </article>
            <div className="flex gap-2 justify-end px-4 pb-6 mt-auto">
                <button onClick={ () => viewMore(dishData?._k) } className="rounded-full bg-neutral-500/40 font-medium py-1 px-2 cursor-pointer text-sm hover:bg-neutral-400 transition-colors">See Details</button>
                <button onClick={ () => onUpdate(dishData?._k) } className="group relative rounded-full bg-blue-600/40 p-1 cursor-pointer hover:bg-blue-400 transition-colors"><Pen size={20} stroke="#00f9" />
                    <div className="absolute top-full mt-2 bg-neutral-700 px-2 py-1 rounded-md text-white hidden group-hover:flex">
                        <span className="text-sm">Edit</span>
                        <div className="size-2 absolute top-0 -mt-[2px] z-0 rotate-45 bg-neutral-700"></div>
                    </div>
                </button>
                <button onClick={ () => onDelete(dishData?._k) } className="group relative rounded-full bg-red-600/40 p-1 cursor-pointer hover:bg-red-400 transition-colors"><Trash size={20} stroke="#f009" />
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