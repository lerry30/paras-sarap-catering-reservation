import { CircleUserRound, MessageCircle, Pen } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { createFullname } from '@/utils/name';
import ProfileImage from '@/components/ProfileImage';
import Link from 'next/link';

const Card = ({ userData={} }) => {
    const id = userData?.id;
    const profilePic = userData?.filename;
    const firstname = userData?.firstname;
    const lastname = userData?.lastname;
    const email = userData?.email;
    const createdAt = userData?.createdAt;

    const [ fullName, setFullName ] = useState('');
    const [ joinedAt, setJoinedAt ] = useState('');

    useEffect(() => {
        const fullname = createFullname(firstname, lastname);
        setFullName(fullname);

        const dateObjectOfCreatedAt = new Date(createdAt || null);
        const fDate = new Intl.DateTimeFormat('en-PH', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,}).format(dateObjectOfCreatedAt);
        setJoinedAt(fDate);
    });

    return (
        <div className="p-4 rounded-xl shadow-md flex gap-4 min-w-[calc(50vw-var(--admin-sidebar-width)/2-20px)] max-w-[36vw] bg-white">
            <ProfileImage image={ profilePic } size={ 130 } className="size-[130px]" /> 
            <div className="flex flex-col justify-center">
                <h2 className="font-headings font-semibold text-xl">{ fullName }</h2>
                <p className="font-paragraphs italic text-neutral-700">{ email }</p>
                <p className="font-paragraphs text-neutral-700 text-sm">Joined At: { joinedAt }</p>
                <div className="flex py-4 gap-x-2">
                    <Link href={ `/admin?display=messages&id=${ id }` }>
                        <span className="bg-pink-500 px-2 py-1 rounded-full text-white text-[12px] font-headings font-bold">Message</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Card;
