'use client';

import CNavbar from '@/components/nav/client/CNavbar';
import Image from 'next/image';
import HeroImg5 from '../../public/images/hero-img-5.jpg';
import WeddingImg from '../../public/images/wedding-img.jpg';
import DebutImg from '../../public/images/debut-img.jpg';
import KidsPartyImg from '../../public/images/kids-party-img.jpg';
import PrivatePartyImg from '../../public/images/private-party-img.jpg';
import Link from 'next/link';
import Card from '@/components/services/Card';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <>
            <CNavbar />
            <main className="w-full py-4 px-page-x">
                <section className="w-full flex flex-col md:flex-row gap-4 md:h-[calc(100vh-var(--nav-height)-32px)]">
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h2 className="font-headings text-3xl">Welcome to Paras Sarap Catering Reservation</h2>
                        <h4 className="font-headings text-lg">Your Premier Catering Reservation Solution</h4>
                        <p className="font-paragraphs text-neutral-700 text-sm">At Paras Sarap Catering Reservation, we streamline catering reservations, eliminating the hassle of coordinating food for your events. From weddings to corporate gatherings, our user-friendly platform and diverse menu options ensure culinary success, allowing you to focus on creating unforgettable moments.</p>
                        <div className="flex gap-2 mt-4">
                            <Link href="/about" className="rounded-sm border-[1px] border-neutral-600 p-2">Learn More</Link>
                            <Link href="/signup" className="rounded-sm border-[1px] bg-skin-ten p-2 text-white">Register</Link>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex md:justify-end md:mt-14">
                        <div className="size-full aspect-square md:size-[400px] md:min-w-[400px] rounded-lg shadow-xl">
                            <Image 
                                src={ HeroImg5 }
                                alt={ 'Paras Cater' }
                                width={ 200 }
                                height={ 200 }
                                sizes='100%'
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transformOrigin: 'center',
                                    borderRadius: '20px'
                                }}
                                priority
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full flex flex-col gap-4 p-4 md:h-[calc(100vh-var(--nav-height)-32px)]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold">About Us</h3>
                    <p></p>
                </section>
                <section className="w-full flex flex-col p-4 md:min-h-[calc(100vh-var(--nav-height)-32px)]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold leading-none">Services</h3>
                    <p className="font-paragraphs w-full text-center text-neutral-700 text-sm">Choose Service</p>
                    <div className="w-full flex justify-center gap-4 mt-4 flex-wrap">
                        <Link href="/reserve?service=wedding">
                            <Card name="Wedding Service" image={ WeddingImg } description={ "Short description" }/>
                        </Link>
                        <Link href="/reserve?service=debut">
                            <Card name="Debut Service" image={ DebutImg } description={ "Short description" }/>
                        </Link>
                        <Link href="/reserve?service=kidsparty">
                            <Card name="Kids Party Service" image={ KidsPartyImg } description={ "Short description" }/>
                        </Link>
                        <Link href="/reserve?service=privateparty">
                            <Card name="Private Party Service" image={ PrivatePartyImg } description={ "Short description" }/>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
