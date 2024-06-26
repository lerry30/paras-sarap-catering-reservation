'use client';

import CNavbar from '@/components/client/nav/CNavbar';
import Image from 'next/image';
import HeroImg5 from '../../public/Hero.png';

import WeddingImg from '../../public/wedding.jpg';
import DebutImg from '../../public/debut.jpeg';
import KidsPartyImg from '../../public/kids-party.jpg';
import PrivatePartyImg from '../../public/private-party.jpeg';

import Link from 'next/link';
import Card from '@/components/client/services/Card';
import Footer from '@/components/Footer';
import FixMiniNavBar from '@/components/client/nav/FixMiniNavBar';

export default function Home() {
    return (
        <div className="pt-[var(--nav-height)]">
            <CNavbar />
            <main className="w-full py-4 px-page-x flex flex-col gap-16 md:gap-4">
                <section className="w-full flex flex-col md:flex-row gap-4 md:h-[calc(100vh-var(--nav-height)-32px)]">
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h2 className="font-headings text-3xl">Welcome to Paras Sarap Catering Reservation</h2>
                        <h4 className="font-headings text-lg">Your Premier Catering Reservation Solution</h4>
                        <p className="font-paragraphs text-neutral-700 text-sm">At Paras Sarap Catering Reservation, we streamline catering reservations, eliminating the hassle of coordinating food for your events. From weddings to corporate gatherings, our user-friendly platform and diverse menu options ensure culinary success, allowing you to focus on creating unforgettable moments.</p>
                        <div className="flex gap-2 mt-4">
                            <Link href="/about" className="rounded-sm border-[1px] border-neutral-600 p-2">Learn More</Link>
                            <Link href="/services" className="rounded-sm border-[1px] bg-skin-ten p-2 text-white">Reserve Now</Link>
                        </div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
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
                <section className="w-full flex flex-col items-center gap-4 md:h-[calc(100vh-var(--nav-height)-32px)]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold">About Us</h3>
                    <p className="font-paragraphs text-center md:w-1/2">Paras Sarap Catering Services started in 2012 as a small business by Mrs. Glecy Reyes Serrano, offering Filipino and street foods. With a focus on quality and customer service, they quickly gained popularity, expanding to accept bulk orders and deliveries for special occasions. Recognized for their delicious food, they entered the catering industry, becoming a renowned name in General Tinio and nearby areas, including Baguio, Pangasinan, and Tarlac.</p>
                    <Link href="/about" className="rounded-sm border-[1px] border-neutral-600 p-2 sm:mt-[70px]">Learn More</Link>
                </section>
                <section className="w-full flex flex-col md:min-h-[calc(100vh-var(--nav-height)-32px)]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold leading-none">Services</h3>
                    <p className="font-paragraphs w-full text-center text-neutral-700 text-sm">Choose Service</p>
                    <div className="w-full flex justify-center gap-4 mt-4 flex-wrap">
                        <Card name="Wedding Service" image={ WeddingImg } description={ "Elevate your special day to unforgettable heights with our bespoke wedding services. From enchanting venues to exquisite decor and flawless execution, let us transform your dream wedding into a reality." } link="/reserve?display=themes&service=wedding"/>
                        <Card name="Debut Service" image={ DebutImg } description={ "Celebrate your debut in style with our curated debutante services. From elegant venues to personalized themes and seamless coordination, let us make your debut an occasion to remember." } link="/reserve?display=themes&service=debut"/>
                        <Card name="Kids Party Service" image={ KidsPartyImg } description={ "Create magical memories for your little ones with our vibrant kids party services. From exciting themes to engaging entertainment and delightful treats, let us bring joy and laughter to your child's special day." } link="/reserve?display=themes&service=kidsparty"/>
                        <Card name="Private Party Service" image={ PrivatePartyImg } description={ "Host an unforgettable private party with our exclusive services. From intimate gatherings to lavish celebrations, our experienced team will tailor every detail to exceed your expectations and create lasting memories." } link="/reserve?display=themes&service=privateparty"/>
                    </div>
                </section>
            </main>
            <FixMiniNavBar />
            <Footer />
        </div>
    );
}
