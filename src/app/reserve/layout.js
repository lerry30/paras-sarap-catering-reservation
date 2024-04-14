'use client';
import CNavbar from '@/components/nav/client/CNavbar';
import Loading from './loading';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function AdminLayout({ 
        children, themes, venues, hasownvenue
     }) {
    const views = {
        themes: themes,
        venues: venues,
        hasownvenue: hasownvenue,
    };

    return (
        <Suspense fallback={ <Loading customStyle="size-full" />}>
            <CNavbar />
            <Display 
                main={ children } 
                slots={ views } 
            />
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
        <main className="">
            { display }
        </main>
    );
}
