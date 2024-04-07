'use client';
import ANavbar from '@/components/nav/admin/ANavbar';
import { useSearchParams } from 'next/navigation';

export default function AdminLayout({ children, dishes, adddish }) {
    const searchParams = useSearchParams();
    const param = searchParams?.get('display');

    const views = {
        dishes: dishes,
        adddish: adddish,
    }

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
