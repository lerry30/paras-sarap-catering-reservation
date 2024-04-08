'use client';
import ANavbar from '@/components/nav/admin/ANavbar';
import { useSearchParams } from 'next/navigation';

export default function AdminLayout({ 
        children, dishes, adddish, updatedish, viewdish, 
        drinks, adddrink, updatedrink 
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
