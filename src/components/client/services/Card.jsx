'use client';
import Image from 'next/image';

const Card = ({ name, image, description }) => {
    return (
        <div className={ `flex flex-col w-full sm:max-w-[280px] min-w-[280px] h-[360px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform cursor-pointer` }>
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
        </div>
    );
}

export default Card;