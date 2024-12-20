'use client';

import Link from 'next/link';

import Logo from '@/components/nav/Logo';
import Select from '@/components/nav/Dropdown';
import Option from '@/components/nav/Option'
import Avatar from '@/components/nav/Avatar';
import CSidebar from './CSidebar';
import Messages from '@/components/nav/Messages';
import { useEffect, useState } from 'react';
import { zUserData } from '@/stores/user';
import { getData, sendJSON } from '@/utils/send';
import { ListChecks } from '@/components/icons/All';
import { viewedreservationapproved as localStorageNameApproved, 
        viewedreservationrejected as localStorageNameRejected } from '@/utils/localStorageNames';
import { toNumber } from '@/utils/number';

const CNavbar = () => {
    const saveUserData = zUserData(state => state?.saveUserData);
    const fullName = zUserData(state => state?.fullname);
    const image = zUserData(state => state?.filename);

    const [ messageCount, setMessageCount ] = useState(0);
    const [ reservationStatusCount, setReservationStatusCount ] = useState(0);
    const [ approvedCount, setApprovedCount ] = useState(0);
    const [ rejectedCount, setRejectedCount ] = useState(0);

    const notification = async () => {
        try {
            if(!fullName || process.env.NEXT_PUBLIC_SYSTEM_STATE === 'DEV') return;
            const getNotifResponse = await getData('/api/notification'); 
            const noOfMessages = toNumber(getNotifResponse?.data?.messageCount);
            const reservationStatus = getNotifResponse?.data?.reservationCount;

            const approved = toNumber(reservationStatus?.approved);
            const rejected = toNumber(reservationStatus?.rejected);

            const noOfViewedReservationApproved = toNumber(localStorage.getItem(localStorageNameApproved));
            const noOfViewedReservationRejected = toNumber(localStorage.getItem(localStorageNameRejected));

            const nApprovedCount = Math.max(approved - noOfViewedReservationApproved, 0);
            const nRejectedCount = Math.max(rejected - noOfViewedReservationRejected, 0);

            setApprovedCount(approved);
            setRejectedCount(rejected);
            setReservationStatusCount(nApprovedCount + nRejectedCount);
            setMessageCount(noOfMessages);
        } catch(error) {}
    }

    const handleViewedNofication = async (notif) => {
        try {
            setMessageCount(0);
            const handleStatusResponse = await sendJSON('/api/notification/viewed', { notif });
        } catch(error) {}
    }

    // onclick the icon for reservation list
    const reservationStatusViewed = () => {
        if(reservationStatusCount <= 0) return;
        setReservationStatusCount(0);
        localStorage.setItem(localStorageNameApproved, approvedCount);
        localStorage.setItem(localStorageNameRejected, rejectedCount);
    }

    useEffect(() => {
        saveUserData();
        const intervalId = setInterval(notification, 4000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="w-screen h-nav-height flex items-center font-headings border-b-[1px] border-neutral-240 fixed top-0 left-0 z-navbar bg-white">
            <nav className="w-full py-2">
                <ul className="px-2 sm:px-page-x flex flex-grow justify-between items-center">
                    <CSidebar />
                    <li className="sm:px-2 py-2 h-nav-item-height max-w-[30%] min-w-[200px] rounded-full">
                        <Logo />
                    </li>

                    <ul className="hidden lg:flex items-center gap-1">
                        <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                            <Link href="/about" className="py-2 px-4 max-h-[40px] hover:text-white">About</Link>
                        </li>
                        <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                            <Link href="/contact" className="py-2 px-4 max-h-[40px] hover:text-white">Contact</Link>
                        </li>
                        <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                            <Link href="/faqs" className="py-2 px-4 max-h-[40px] hover:text-white">FAQs</Link>
                        </li>
                        <li className="h-nav-item-height flex items-center rounded-sm">
                            <Select name="Services" className="py-2 max-h-[40px]">
                                <Option href="/reserve?display=themes&service=wedding&set=1&series=1">Wedding Service</Option>
                                <Option href="/reserve?display=themes&service=debut&set=1&series=1">Debut Service</Option>
                                <Option href="/reserve?display=themes&service=kidsparty&set=1&series=1">Kids Party Service</Option>
                                <Option href="/reserve?display=themes&service=privateparty&set=1&series=1">Private Party Service</Option>
                            </Select>
                        </li>
                        {/* <li className="h-nav-item-height flex items-center rounded-sm">
                            <Select name="Packages" className="py-2 max-h-[40px]">
                                <Option href="">Wedding Package</Option>
                                <Option href="">Debut Package</Option>
                                <Option href="">Kids Party Package</Option>
                                <Option href="">Private Party Package</Option>
                            </Select>
                        </li>
                        <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                            <Link href="" className="py-2 px-4 max-h-[40px] hover:text-white">Contact</Link>
                        </li> */}
                    </ul>

                    <ul className="flex items-center">
                        { !fullName ?
                                <>
                                    <li className="h-nav-item-height flex items-center rounded-sm">
                                        <Link href="/signin" className="py-2 pl-3 sm:px-4 max-h-[40px] text-neutral-600">LogIn</Link>
                                    </li>
                                    <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                                        <Link href="/signup" className="py-2 pl-3 sm:px-4 max-h-[40px] hover:text-white font-semibold">Register</Link>
                                    </li>
                                </>
                            :
                                <>
                                    <li onClick={ reservationStatusViewed } className="relative h-nav-item-height hidden rounded-full p-1 items-center justify-center sm:flex">
                                        <Link href="/reserve?display=myreservations" className="group size-[calc(var(--nav-item-height)-10px)] flex items-center justify-center rounded-full hover:bg-skin-ten">
                                            <ListChecks size={24} strokeWidth={2} className="group-hover:stroke-white"/>
                                        </Link>
                                        { reservationStatusCount > 0 && <span className="absolute size-[20px] right-0 top-[4px] text-[12px] text-white font-semibold font-paragraphs bg-red-600 flex items-center justify-center rounded-full animate-bounce">{ reservationStatusCount }</span> }
                                    </li>
                                    <li onClick={ () => handleViewedNofication('messages') } className="relative h-nav-item-height hidden rounded-full p-1 sm:flex">
                                        <Messages />
                                        { messageCount > 0 && <span className="absolute size-[20px] right-0 top-[4px] text-[12px] text-white font-semibold font-paragraphs bg-red-600 flex items-center justify-center rounded-full animate-bounce">{ messageCount }</span> }
                                    </li>
                                    <li className="h-nav-item-height flex rounded-full">
                                        <Avatar name={ fullName } image={ image }/>
                                    </li>
                                </>
                        }
                    </ul>
                </ul>
            </nav>
        </header>
    );
}

export default CNavbar;
