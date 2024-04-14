'use client';
import ANavbar from '@/components/nav/admin/ANavbar';
import Loading from '@/components/Loading';
import { zDish } from '@/stores/dish';
import { zDrink } from '@/stores/drink';
import { zVenue } from '@/stores/venue';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// reload zustan data from localstorage
zDish.getState().init();
zDrink.getState().init();
zVenue.getState().init();

export default function AdminLayout({ 
        children, dashboard,
        dishes, adddish, updatedish, viewdish, 
        drinks, adddrink, updatedrink, viewdrink,
        venues, addvenue, updatevenue, viewvenue,
        viewweddingthemes,
        menus, addmenu, dishesselection, drinksselection, updatemenu, viewmenu,
        schedules,
        users,
    }) {
    // Keep in mind to always restart the server every time a new slot is added.

    const views = {
        dishes: dishes,
        adddish: adddish,
        updatedish: updatedish,
        viewdish: viewdish,
        drinks: drinks,
        adddrink: adddrink,
        updatedrink: updatedrink,
        viewdrink: viewdrink,
        venues: venues,
        addvenue: addvenue,
        updatevenue: updatevenue,
        viewvenue: viewvenue,
        viewweddingthemes: viewweddingthemes,
        menus: menus,
        addmenu: addmenu,
        dishesselection: dishesselection,
        drinksselection: drinksselection,
        updatemenu: updatemenu,
        viewmenu: viewmenu,
        schedules: schedules,
        dashboard: dashboard,
        users: users,
    }

    return (
        <>
            <Suspense fallback={ <Loading customStyle="size-full" />}>
                <ANavbar />
                <Display 
                    main={ children } 
                    slots={ views } 
                />
            </Suspense>
        </>
    );
}

/**
    Just because of useSearchParams I forced
    to create separated component just to fucking
    wrap it in Suspense.
*/
const Display = ({ main, slots }) => {
    const searchParams = useSearchParams();
    const slot = searchParams.get('display');
    const display = slots[ slot ] || main;
    return (
        <main className="sm:pl-[var(--admin-sidebar-width)]">
            { display }
        </main>
    );
}
