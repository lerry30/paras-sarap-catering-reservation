import Option from '@/components/nav/Option';
import ParentOption from '@/components/nav/SubDrawer';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const ASidebar = () => {
    const searchParams = useSearchParams();
    const pages = { dishes: false };

    useState(() => {
        const currentDisplay = (searchParams?.get('display') || '').toLowerCase().trim();
        pages[currentDisplay] = true;
    }, [ searchParams ]);

    return  (
        <section className="absolute left-0 top-[var(--nav-height)] w-admin-sidebar h-[calc(100vh-var(--nav-height))] p-2 pt-4 border-r border-neutral-600/20 flex flex-col gap-2">
            <Option href="/admin?display=dashboard" className="!rounded-full px-4" icon="square-arrow-right">Dashboard</Option>
            <Option href="/admin?display=users" className="!rounded-full px-4" icon="square-arrow-right">Users</Option>
            <Option href="/admin?display=schedules" className="!rounded-full px-4">Calendar</Option>
            <Option href="/admin?display=venues" className="!rounded-full px-4" icon="square-arrow-right">Venues</Option>
            <ParentOption text="Foods & Beverages" className="px-4">
                <Option href="/admin?display=dishes" className={ `!rounded-full px-4` }>Dishes</Option>
                <Option href="/admin?display=menus" className="!rounded-full px-4">Menus</Option>
                <Option href="/admin?display=drinks" className="!rounded-full px-4">Drinks</Option>
            </ParentOption>
            <ParentOption text="Themes" className="px-4">
                <Option href="/admin?display=weddingthemes" className="!rounded-full px-4">Wedding</Option>
                <Option href="/admin?display=debutthemes" className="!rounded-full px-4">Debut</Option>
                <Option href="/admin?display=kidthemes" className="!rounded-full px-4">Kids</Option>
                <Option href="/admin?display=privatethemes" className="!rounded-full px-4">Private</Option>
            </ParentOption>
        </section>
    );
}

export default ASidebar;
