'use client';

import WeddingImg from '../../../public/wedding.jpg';
import DebutImg from '../../../public/debut.jpeg';
import KidsPartyImg from '../../../public/kids-party.jpg';
import PrivatePartyImg from '../../../public/private-party.jpeg';
import Link from 'next/link';
import Card from '@/components/client/services/Card';
import CNavbar from '@/components/client/nav/CNavbar';
import Footer from '@/components/Footer';

const Services = () => {
    return <>
        <CNavbar />
        <main className="mb-4">
            <section className="w-screen min-h-screen flex justify-center items-center">
                <div className="w-full flex flex-col p-4 md:min-h-[calc(100vh-var(--nav-height)-32px)]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold leading-none">Services</h3>
                    <p className="font-paragraphs w-full text-center text-neutral-700 text-sm">Choose Service</p>
                    <div className="w-full flex justify-center gap-4 mt-4 flex-wrap">
                        <Link href="/reserve?display=themes&service=wedding">
                            <Card name="Wedding Service" image={ WeddingImg } description={ "Elevate your special day to unforgettable heights with our bespoke wedding services. From enchanting venues to exquisite decor and flawless execution, let us transform your dream wedding into a reality." }/>
                        </Link>
                        <Link href="/reserve?display=themes&service=debut">
                            <Card name="Debut Service" image={ DebutImg } description={ "Celebrate your debut in style with our curated debutante services. From elegant venues to personalized themes and seamless coordination, let us make your debut an occasion to remember." }/>
                        </Link>
                        <Link href="/reserve?display=themes&service=kidsparty">
                            <Card name="Kids Party Service" image={ KidsPartyImg } description={ "Create magical memories for your little ones with our vibrant kids party services. From exciting themes to engaging entertainment and delightful treats, let us bring joy and laughter to your child's special day." }/>
                        </Link>
                        <Link href="/reserve?display=themes&service=privateparty">
                            <Card name="Private Party Service" image={ PrivatePartyImg } description={ "Host an unforgettable private party with our exclusive services. From intimate gatherings to lavish celebrations, our experienced team will tailor every detail to exceed your expectations and create lasting memories." }/>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
        <Footer/>
    </>
}

export default Services;