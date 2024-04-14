'use client';
import CNavbar from '@/components/nav/client/CNavbar';

export default function AdminLayout({ children }) {
    return (
        <>
            <CNavbar />
            <main className="">
                { children }
            </main>
        </>
    );
}
