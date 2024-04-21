'use client';
import CNavbar from '@/components/client/nav/CNavbar';
import Loading from './loading';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { zMenu } from '@/stores/menu';
import { zReservation } from '@/stores/reservation';

zMenu.getState().init();
zReservation.getState().init();

export default function AdminLayout({ 
        children, 
        themes, 
        venues, 
        providevenuelocation, 
        menus,
        createmenu,
        dishesselection,
        drinksselection,
        schedule,
        reviewbudget,
        myreservation,
     }) {
    const views = {
        themes: themes,
        venues: venues,
        providevenuelocation: providevenuelocation,
        menus: menus,
        createmenu: createmenu,
        dishesselection: dishesselection,
        drinksselection: drinksselection,
        schedule: schedule,
        reviewbudget: reviewbudget,
        myreservations: myreservation,
    };

    return (
        <Suspense fallback={ <Loading customStyle="size-full" />}>
            <CNavbar />
            <Display 
                main={ children } 
                slots={ views } 
            />
            <Footer />
        </Suspense>
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
        <main className="min-h-screen">
            { display }
        </main>
    );
}
