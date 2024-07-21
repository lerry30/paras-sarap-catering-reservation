'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Card = ({ name, image, description, link='/' }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col w-full sm:max-w-[280px] min-w-[280px] h-[360px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
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
                }}
                priority
            />
            <article className="px-4 pt-2 pb-0 overflow-hidden min-h-[100px]">
                <h3 className="font-headings font-semibold">{ name }</h3>
                <p className="font-paragraphs text-sm line-clamp-3">{ description }</p>
            </article>
            <section className="grow p-4 flex justify-end items-end">
                <button onClick={ () => router.push(link) } className="font-headings bg-skin-ten px-2 py-[2px] text-white mb-2">Reserve Now</button>
            </section>
        </div>
    );
}

export default Card;