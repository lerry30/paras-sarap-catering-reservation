'use client';

import CNavbar from '@/components/client/nav/CNavbar';
import Image from 'next/image';
import BgImg from '../../public/bg.jpg';
//import HeroImg5 from '../../public/Hero.png';
import Event01 from '../../public/event01.jpg';
import Event02 from '../../public/event02.jpg';
import Event03 from '../../public/event03.jpg';

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
                <section className="relative w-full h-[1100px] md:h-[900px] lg:h-[calc(100vh-var(--nav-height))]"> 
                    <div className="absolute -top-4 -left-[var(--page-x-padding)] -right-[var(--page-x-padding)] bottom-0 bg-gradient-to-r from-teal-900 via-teal-800 to-[var(--skin-ten)]">
                        <Image 
                            src={ BgImg }
                            alt={ 'Background Image' }
                            sizes='100%'
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transformOrigin: 'center',
                                position: 'absolute',
                                mixBlendMode: 'overlay',
                                zIndex: 2,
                                opacity: .18,
                                filter: 'blur(6px)',
                            }}
                            priority
                        />
                    </div>
                    <div className="absolute z-[3] size-full flex flex-col gap-4 lg:flex-row">
                        <div className="w-full lg:w-1/2 flex flex-col justify-center text-white">
                            <h2 className="font-headings text-4xl font-bold">Welcome to Paras Sarap Catering Reservation</h2>
                            <h4 className="font-headings text-lg">Your Premier Catering Reservation Solution</h4>
                            <p className="font-paragraphs text-neutral-100 text-sm ">At Paras Sarap Catering Reservation, we streamline catering reservations, eliminating the hassle of coordinating food for your events. From weddings to corporate gatherings, our user-friendly platform and diverse menu options ensure culinary success, allowing you to focus on creating unforgettable moments.</p>
                            <div className="flex gap-2 mt-4">
                                <Link href="/about" className="rounded-sm border-[1px] border-neutral-600 p-2">Learn More</Link>
                                <Link href="/services" className="rounded-sm border-[1px] bg-skin-ten p-2 text-white">Reserve Now</Link>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 flex lg:justify-end lg:mt-14 min-h-[600px] lg:min-h-0">
                            <div className="relative size-full aspect-square lg:size-[400px] lg:min-w-[400px] rounded-lg">
                                <div className="absolute w-[310px] h-[210px] overflow-hidden border-[8px] border-solid border-white rounded-md transform-gpu left-[calc(50%-50px)] top-[calc(50%-80px)] lg:left-[-80px] lg:top-[20px] lg:animate-upright01 rotate-[-20deg] animate-mobileupright01">
                                    <Image 
                                        src={ Event01 }
                                        alt={ 'Paras Sarap Wedding Venue' }
                                        sizes='100%'
                                        style={{
                                            objectFit: 'cover',
                                            transformOrigin: 'center',
                                        }}
                                        priority
                                    />
                                </div>

                                <div className="absolute w-[300px] h-[160px] overflow-hidden border-[8px] border-solid border-white rounded-md left-[calc(50%+50px)] top-1/2 lg:left-[60px] lg:top-[140px] lg:translate-x-0 lg:translate-y-0 lg:animate-upright02 animate-mobileupright02">
                                    <Image 
                                        src={ Event02 }
                                        alt={ 'Paras Sarap Debut Venue' }
                                        sizes='100%'
                                        style={{
                                            objectFit: 'cover',
                                            transformOrigin: 'bottom',
                                        }}
                                        priority
                                    />
                                </div>
                                <div className="absolute w-[220px] h-[160px] overflow-hidden border-[8px] border-solid border-white rounded-md transform-gpu left-[calc(50%-80px)] top-[calc(50%+100px)] lg:left-[-20px] lg:top-[240px] lg:translate-x-0 lg:translate-y-0 lg:animate-upright03 animate-mobileupright03">
                                    <Image 
                                        src={ Event03 }
                                        alt={ 'Paras Sarap Christening' }                                    
                                        sizes='100%'
                                        style={{
                                            objectFit: 'cover',
                                            transformOrigin: 'center',
                                        }}
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full flex flex-col items-center gap-4 md:h-[calc(100vh-var(--nav-height))]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold mt-[40px]">About Us</h3>
                    <p className="font-paragraphs text-center md:w-1/2">Paras Sarap Catering Services started in 2012 as a small business by Mrs. Glecy Reyes Serrano, offering Filipino and street foods. With a focus on quality and customer service, they quickly gained popularity, expanding to accept bulk orders and deliveries for special occasions. Recognized for their delicious food, they entered the catering industry, becoming a renowned name in General Tinio and nearby areas, including Baguio, Pangasinan, and Tarlac.</p>
                    <Link href="/about" className="rounded-sm border-[1px] border-neutral-600 p-2 sm:mt-[70px]">Learn More</Link>
                </section>
                <section className="w-full flex flex-col md:min-h-[calc(100vh-var(--nav-height))]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold leading-none">Services</h3>
                    <p className="font-paragraphs w-full text-center text-neutral-700 text-sm">Choose Service</p>
                    <div className="w-full flex justify-center gap-4 mt-4 flex-wrap">
                        <Card name="Wedding Service" image={ WeddingImg } description={ "Elevate your special day to unforgettable heights with our bespoke wedding services. From enchanting venues to exquisite decor and flawless execution, let us transform your dream wedding into a reality." } link="/reserve?display=themes&service=wedding&set=1&series=1"/>
                        <Card name="Debut Service" image={ DebutImg } description={ "Celebrate your debut in style with our curated debutante services. From elegant venues to personalized themes and seamless coordination, let us make your debut an occasion to remember." } link="/reserve?display=themes&service=debut&set=1&series=1"/>
                        <Card name="Kids Party Service" image={ KidsPartyImg } description={ "Create magical memories for your little ones with our vibrant kids party services. From exciting themes to engaging entertainment and delightful treats, let us bring joy and laughter to your child's special day." } link="/reserve?display=themes&service=kidsparty&set=1&series=1"/>
                        <Card name="Private Party Service" image={ PrivatePartyImg } description={ "Host an unforgettable private party with our exclusive services. From intimate gatherings to lavish celebrations, our experienced team will tailor every detail to exceed your expectations and create lasting memories." } link="/reserve?display=themes&service=privateparty&set=1&series=1"/>
                    </div>
                </section>
            </main>
            <FixMiniNavBar />
            <Footer />
        </div>
    );
}
