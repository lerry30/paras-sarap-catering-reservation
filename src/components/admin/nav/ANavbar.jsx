'use client';
import ASidebar from '@/components/admin/nav/ASidebar';
import Logo from '@/components/nav/Logo';
import Avatar from '@/components/nav/Avatar';
import Link from 'next/link';
import { zUserData } from '@/stores/user';
import { useEffect, useState } from 'react';
import { getData, sendJSON } from '@/utils/send';
import { ListChecks, MessageCircle } from '@/components/icons/All';

const ANavbar = () => {
    const saveUserData = zUserData(state => state.saveUserData);
    const fullName = zUserData(state => state.fullname);
    const image = zUserData(state => state?.filename);

    const [ messageCount, setMessageCount ] = useState(0);
    const [ reservationPendingCount, setReservationPendingCount ] = useState(0);

    const notification = async () => {
        try {
            const getNotifResponse = await getData('/api/notification'); 
            const noOfMessages = getNotifResponse?.data?.messageCount || 0;
            const noOfReservationPending = getNotifResponse?.data?.reservationCount || 0

            setMessageCount(noOfMessages);
            setReservationPendingCount(noOfReservationPending);
        } catch(error) {}
    }

    const handleViewedNofication = async (notif) => {
        try {
            setMessageCount(0);
            const handleStatusResponse = await sendJSON('/api/notification/viewed', { notif });
        } catch(error) {}
    }

    useEffect(() => {
        saveUserData();
        const intervalId = setInterval(notification, 4000);
        return () => clearInterval(intervalId);
    }, [])

    return (
        <header className="w-full h-nav-height flex items-center font-headings border-b-[1px] border-neutral-240 fixed top-0 left-0 z-navbar bg-white">
            <nav className="w-full py-2">
            <ul className="px-2 flex flex-grow justify-between items-center">
                <ASidebar />
                <li className="p-2 h-nav-item-height max-w-[30%] min-w-[230px] rounded-full">
                    <Logo />
                </li>

                <ul className="flex items-center gap-4">
                    <li className="relative h-nav-item-height flex items-center justify-center">
                        <Link href="/admin?display=reservationlist" className="group size-[calc(var(--nav-item-height)-10px)] flex items-center justify-center rounded-full hover:bg-skin-ten">
                            <ListChecks size={24} strokeWidth={2} className="group-hover:stroke-white"/>
                        </Link>
                        { reservationPendingCount > 0 && <span className="absolute size-[20px] right-0 top-[4px] text-[12px] text-white font-semibold font-paragraphs bg-red-600 flex items-center justify-center rounded-full animate-bounce">{ reservationPendingCount }</span> }
                    </li>
                    <li className="relative h-nav-item-height flex items-center justify-center">
                        <Link href="/admin?display=messages" onClick={ () => handleViewedNofication('messages') } className="group size-[calc(var(--nav-item-height)-10px)] flex items-center justify-center rounded-full hover:bg-skin-ten">
                            <MessageCircle size={24} strokeWidth={2} className="group-hover:stroke-white"/>
                        </Link>
                        { messageCount > 0 && <span className="absolute size-[20px] right-0 top-[4px] text-[12px] text-white font-semibold font-paragraphs bg-red-600 flex items-center justify-center rounded-full animate-bounce">{ messageCount }</span> }
                    </li>
                    <li className="h-nav-item-height flex rounded-full">
                        <Avatar name={ fullName } image={ image }/>
                    </li>
                </ul>
            </ul>
            </nav>
        </header>
    );
}

export default ANavbar;
// backdrop-blur-lg
