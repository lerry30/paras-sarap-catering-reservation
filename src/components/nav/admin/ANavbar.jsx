'use client';
import ASidebar from '@/components/nav/admin/ASidebar';
import Logo from '@/components/nav/Logo';
import Avatar from '@/components/nav/Avatar';
import { zUserData } from '@/stores/user';
import { useEffect } from 'react';

const ANavbar = () => {
    const saveUserData = zUserData(state => state.saveUserData);
    const fullName = zUserData(state => state.fullname);

    useEffect(() => {
        saveUserData();
    }, [])

    return (
        <header className="w-full h-nav-height flex items-center font-headings border-b-[1px] border-neutral-240 sticky top-0 left-0 z-navbar backdrop-blur-sm">
            <nav className="w-full py-2">
            <ul className="px-2 sm:px-page-x flex flex-grow justify-between items-center">
                <ASidebar />
                <li className="p-2 h-nav-item-height max-w-[30%] min-w-[230px] rounded-full">
                    <Logo />
                </li>

                <ul className="flex items-center">
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