'use client';
import CNavbar from '@/components/nav/client/CNavbar';
import Loading from './loading';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Footer from '@/components/Footer';

export default function AdminLayout({ 
        children, 
        themes, 
        venues, 
        providevenuelocation, 
        menus,
        createmenu,
     }) {
    const views = {
        themes: themes,
        venues: venues,
        providevenuelocation: providevenuelocation,
        menus: menus,
        createmenu: createmenu,
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
