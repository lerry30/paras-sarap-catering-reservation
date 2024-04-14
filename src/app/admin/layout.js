'use client';
import ANavbar from '@/components/nav/admin/ANavbar';
import Loading from './loading';
import { zDish } from '@/stores/dish';
import { zDrink } from '@/stores/drink';
import { zVenue } from '@/stores/venue';
import { Suspense } from 'react';

// reload zustan data from localstorage
zDish.getState().init();
zDrink.getState().init();
zVenue.getState().init();

export default function AdminLayout({ children }) {
    return (
        <>
            <ANavbar />
            <Suspense fallback={ <Loading customStyle="size-full" /> }>
                <main className="sm:pl-[var(--admin-sidebar-width)]">
                    { children }
                </main>
            </Suspense>
        </>
    );
}
