'use client';
import ANavbar from '@/components/nav/admin/ANavbar';
import { zDish } from '@/stores/dish';
import { useSearchParams } from 'next/navigation';

// reload zustan data from localstorage
zDish.getState().init();

export default function AdminLayout({ 
        children, dishes, adddish, updatedish, viewdish, 
        drinks, adddrink, updatedrink, viewdrink,
    }) {
    const searchParams = useSearchParams();
    const param = searchParams?.get('display');


    const views = {
        dishes: dishes,
        adddish: adddish,
        updatedish: updatedish,
        viewdish: viewdish,
        drinks: drinks,
        adddrink: adddrink,
        updatedrink: updatedrink,
        viewdrink: viewdrink
    }

    // Keep in mind to always restart the server every time a new slot is added.
    const display = views[param];
    return (
        <>
            <ANavbar />
            <main className="sm:pl-[var(--admin-sidebar-width)]">
                { display }
            </main>
        </>
    );
}
