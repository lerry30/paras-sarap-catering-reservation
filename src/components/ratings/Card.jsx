'use client';

import ProfileImage from '@/components/ProfileImage';
import { Star } from '@/components/icons/All';
import { toNumber } from '@/utils/number';

const RatingCard = ({ data }) => {
    const { name, filename, point, message } = data;
    const noOfPoints = toNumber(point);
    const noOfStars = Math.ceil(noOfPoints);
    const starSize = 34;

    return ( 
        <main className="flex flex-col w-full sm:max-w-[280px] min-w-[280px] h-[360px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform p-4 border-2 divide-y bg-white [&>section]:py-2">
            <section className="flex items-center gap-2">
                <ProfileImage image={ filename } size={ 64 } className="size-[64px]"/>
                <h3>{ name }</h3>
            </section>
            <section className="flex justify-between">
                {
                    Array(5).fill(null).map((_, index) => {
                        if(index === noOfStars-1) {
                            const shade = noOfStars - noOfPoints;
                            if(shade > 0) {
                                const lastStarSize = Math.ceil(starSize * shade);
                                return (
                                    <div key={index} className="relative" style={{ width: `${starSize}px`, height: `${starSize}px` }}>
                                        <Star size={starSize} className="absolute stroke-slate-800" />
                                        <div className="absolute overflow-hidden" style={{ width: `${lastStarSize}px`, height: `${starSize}px` }}>
                                            <Star size={starSize} className="fill-yellow-600 stoke-slate-800" />
                                        </div>
                                    </div>
                                )
                            }
                        }

                        if(index < noOfStars) return <Star key={index} size={starSize} className="fill-yellow-600 stroke-slate-800" />
                        return <Star key={index} size={starSize} className="stroke-slate-400"/>
                    })
                }
            </section>
            <section className="">
                <h3 className="font-headings font-semibold text-center text-sm">{ point }</h3>
            </section>
            <section className="h-full px-4 py-2 bg-neutral-100 rounded-md">
                <p className="font-paragraphs italic">{ message }</p>
            </section>
        </main>
    );
}

export default RatingCard;
