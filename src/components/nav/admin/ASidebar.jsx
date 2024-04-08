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
        <section className="absolute left-0 top-[var(--nav-height)] w-admin-sidebar h-screen p-2 pt-4 border-r border-neutral-600/20 flex flex-col gap-2">
            <Option href="/" className="!rounded-full px-4" icon="square-arrow-right">
                Item 1
            </Option>
            <ParentOption text="Foods & Beverages" className="px-4">
                <Option href="/admin?display=dishes" className={ `!rounded-full px-4` }>Dishes</Option>
                <Option href="" className="!rounded-full px-4">Menus</Option>
                <Option href="/admin?display=drinks" className="!rounded-full px-4">Drinks</Option>
            </ParentOption>
            <ParentOption text="Packages" className="px-4">
                <Option href="" className="!rounded-full px-4">Item 6</Option>
                <Option href="" className="!rounded-full px-4">Item 7</Option>
                <Option href="" className="!rounded-full px-4">Item 8</Option>
                <Option href="" className="!rounded-full px-4">Item 9</Option>
            </ParentOption>
            <Option href="/" className="!rounded-full px-4">Item 10</Option>
        </section>
    );
}

export default ASidebar;