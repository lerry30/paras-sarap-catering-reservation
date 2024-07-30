'use client';

import ProfileImage from '@/components/ProfileImage';

const RatingCard = ({ data }) => {
    const { name, filename, point, message } = data;

    return ( 
        <div className="flex flex-col w-full sm:max-w-[280px] min-w-[280px] h-[360px] rounded-lg shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
            <ProfileImage image={ filename } size={ 64 } className="size-[64px]"/>
            <h3>{ name }</h3>
        </div>
    );
}

export default RatingCard;
