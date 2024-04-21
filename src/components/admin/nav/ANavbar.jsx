'use client';
import ASidebar from '@/components/admin/nav/ASidebar';
import Logo from '@/components/nav/Logo';
import Avatar from '@/components/nav/Avatar';
import Link from 'next/link';
import { zUserData } from '@/stores/user';
import { useEffect } from 'react';
import { ListChecks, MessageCircle } from '@/components/icons/All';

const ANavbar = () => {
    const saveUserData = zUserData(state => state.saveUserData);
    const fullName = zUserData(state => state.fullname);

    useEffect(() => {
        saveUserData();
    }, [])

    return (
        <header className="w-full h-nav-height flex items-center font-headings border-b-[1px] border-neutral-240 sticky top-0 left-0 z-navbar bg-white">
            <nav className="w-full py-2">
            <ul className="px-2 flex flex-grow justify-between items-center">
                <ASidebar />
                <li className="p-2 h-nav-item-height max-w-[30%] min-w-[230px] rounded-full">
                    <Logo />
                </li>

                <ul className="flex items-center gap-4">
                    <li className="h-nav-item-height flex items-center justify-center">
                        <Link href="/admin?display=reservationlist" className="group size-[calc(var(--nav-item-height)-10px)] flex items-center justify-center rounded-full hover:bg-skin-ten">
                            <ListChecks size={24} strokeWidth={2} className="group-hover:stroke-white"/>
                        </Link>
                    </li>
                    <li className="h-nav-item-height flex items-center justify-center">
                        <Link href="/admin?display=messages" className="group size-[calc(var(--nav-item-height)-10px)] flex items-center justify-center rounded-full hover:bg-skin-ten">
                            <MessageCircle size={24} strokeWidth={2} className="group-hover:stroke-white"/>
                        </Link>
                    </li>
                    <li className="h-nav-item-height flex rounded-full">
                        <Avatar name={ fullName }/>
                    </li>
                </ul>
            </ul>
            </nav>
        </header>
    );
}

export default ANavbar;
// backdrop-blur-lg