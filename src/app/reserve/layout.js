'use client';
import CNavbar from '@/components/nav/client/CNavbar';
import { useSearchParams } from 'next/navigation';

export default function AdminLayout({ 
        children, 
        themes, 
        venues, hasownvenue
    }) {
    const searchParams = useSearchParams();
    const param = searchParams?.get('display');

    const views = {
        themes: themes,
        venues: venues,
        hasownvenue: hasownvenue,
    }

    // Keep in mind to always restart the server every time a new slot is added.
    const display = views[param] || children;
    return (
        <>
            <CNavbar />
            <main className="">
                { display }
            </main>
        </>
    );
}
