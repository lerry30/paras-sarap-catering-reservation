'use client';

import CNavbar from '@/components/client/nav/CNavbar';
import FixMiniNavBar from '@/components/client/nav/FixMiniNavBar'; 
import Footer from '@/components/Footer';

import { CircleUserRound } from '@/components/icons/All';

const Profile = () => {
    return (
        <div className="pt-[var(--nav-height)]">
            <CNavbar />
            <main className="w-full py-4 px-page-x flex">
                <section className="size-full lg:h-[calc(100vh-var(--nav-height))]">
                    <CircleUserRound strokeWidth={1} className="size-full" />
                </section>
            </main>
            <FixMiniNavBar />
            <Footer />
        </div>
    );
}

export default Profile;
