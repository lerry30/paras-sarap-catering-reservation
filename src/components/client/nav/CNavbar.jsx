'use client';

import Link from 'next/link';

import Logo from '@/components/nav/Logo';
import Select from '@/components/nav/Dropdown';
import Option from '@/components/nav/Option'
import Avatar from '@/components/nav/Avatar';
import CSidebar from './CSidebar';
import Messages from '@/components/nav/Messages';
import { useEffect } from 'react';
import { zUserData } from '@/stores/user';

const CNavbar = () => {
    const saveUserData = zUserData(state => state.saveUserData);
    const fullName = zUserData(state => state.fullname);

    useEffect(() => {
        saveUserData();
    }, [])

    return (
        <header className="w-full h-nav-height flex items-center font-headings border-b-[1px] border-neutral-240 sticky top-0 left-0 z-navbar bg-white">
            <nav className="w-full py-2">
                <ul className="px-2 sm:px-page-x flex flex-grow justify-between items-center">
                    <CSidebar />
                    <li className="p-2 h-nav-item-height max-w-[30%] min-w-[230px] rounded-full">
                        <Logo />
                    </li>

                    <ul className="hidden lg:flex items-center gap-1">
                        <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                            <Link href="" className="py-2 px-4 max-h-[40px] hover:text-white">About</Link>
                        </li>
                        <li className="h-nav-item-height flex items-center rounded-sm">
                            <Select name="Services" className="py-2 max-h-[40px]">
                                <Option href="/reserve?display=themes&service=wedding">Wedding Service</Option>
                                <Option href="/reserve?display=themes&service=debut">Debut Service</Option>
                                <Option href="/reserve?display=themes&service=kidsparty">Kids Party Service</Option>
                                <Option href="/reserve?display=themes&service=privateparty">Private Party Service</Option>
                            </Select>
                        </li>
                        <li className="h-nav-item-height flex items-center rounded-sm">
                            <Select name="Packages" className="py-2 max-h-[40px]">
                                <Option href="">Wedding Package</Option>
                                <Option href="">Debut Package</Option>
                                <Option href="">Kids Party Package</Option>
                                <Option href="">Private Party Package</Option>
                            </Select>
                        </li>
                        <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                            <Link href="" className="py-2 px-4 max-h-[40px] hover:text-white">Contact</Link>
                        </li>
                    </ul>

                    <ul className="flex items-center">
                        { !fullName ?
                                <>
                                    <li className="h-nav-item-height flex items-center rounded-sm">
                                        <Link href="/signin" className="py-2 px-4 max-h-[40px] text-neutral-600">LogIn</Link>
                                    </li>
                                    <li className="h-nav-item-height flex items-center rounded-sm hover:bg-skin-ten transition-colors">
                                        <Link href="/signup" className="py-2 px-4 max-h-[40px] hover:text-white font-semibold">Register</Link>
                                    </li>
                                </>
                            :
                                <>
                                    <li className="h-nav-item-height flex rounded-full p-1">
                                        <Messages />
                                    </li>
                                    <li className="h-nav-item-height flex rounded-full">
                                        <Avatar name={ fullName }/>
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
