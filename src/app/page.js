'use client';

import CNavbar from '@/components/client/nav/CNavbar';
import Image from 'next/image';
import BgImg from '../../public/bg.jpg';
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
import RatingCard from '@/components/ratings/Card';
import Carousel from '@/components/Carousel';

import { useLayoutEffect, useState } from 'react';
import { getData } from '@/utils/send';

import { ErrorModal } from '@/components/Modal';
import { generateGoogleMapsDirection } from '@/utils/googleMapsDirection'; 

export default function Home() {
    const [ ratings, setRatings ] = useState([]);
    const [ accessMapMessage, setAccessMapMessage ] = useState('');

    const getRating = async () => {
        try {
            const response = await getData('/api/ratings');
            const rates = response?.data;

            setRatings(rates);
        } catch(error) {
            console.log(error);
        }
    }

    useLayoutEffect(() => {
        getRating();
    }, []);

    return (
        <div className="pt-[var(--nav-height)]">
            <CNavbar />
            <main className="w-full py-4 px-page-x flex flex-col gap-24">
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
                <section className="w-full flex flex-col gap-4 md:h-[calc(100vh-140px)]">
                    <h3 className="font-headings w-full text-lg font-semibold mt-[60px] pb-4 border-b-2 border-dotted border-neutral-400">About Us</h3>
                    <p className="font-paragraphs font-thin text-2xl antialiased">Paras Sarap Catering Services started in 2012 as a small business by Mrs. Glecy Reyes Serrano, offering Filipino and street foods. With a focus on quality and customer service, they quickly gained popularity, expanding to accept bulk orders and deliveries for special occasions. Recognized for their delicious food, they entered the catering industry, becoming a renowned name in General Tinio and nearby areas, including Baguio, Pangasinan, and Tarlac.</p>
                    <Link href="/about" className="w-fit rounded-sm border-[1px] border-neutral-600 p-2 sm:mt-[20px]">Learn More</Link>
                </section>
                <section className="w-full flex flex-col gap-4 md:h-[calc(100vh-140px)]">
                    <h3 className="font-headings w-full text-lg font-semibold leading-none">Services</h3>
                    <p className="font-paragraphs w-full text-neutral-700 font-thin text-3xl">Choose Service</p>
                    <div className="w-full flex justify-between gap-4 mt-4 flex-wrap">
                        <Card name="Wedding Service" image={ WeddingImg } description={ "Elevate your special day to unforgettable heights with our bespoke wedding services. From enchanting venues to exquisite decor and flawless execution, let us transform your dream wedding into a reality." } link="/reserve?display=themes&service=wedding&set=1&series=1"/>
                        <Card name="Debut Service" image={ DebutImg } description={ "Celebrate your debut in style with our curated debutante services. From elegant venues to personalized themes and seamless coordination, let us make your debut an occasion to remember." } link="/reserve?display=themes&service=debut&set=1&series=1"/>
                        <Card name="Kids Party Service" image={ KidsPartyImg } description={ "Create magical memories for your little ones with our vibrant kids party services. From exciting themes to engaging entertainment and delightful treats, let us bring joy and laughter to your child's special day." } link="/reserve?display=themes&service=kidsparty&set=1&series=1"/>
                        <Card name="Private Party Service" image={ PrivatePartyImg } description={ "Host an unforgettable private party with our exclusive services. From intimate gatherings to lavish celebrations, our experienced team will tailor every detail to exceed your expectations and create lasting memories." } link="/reserve?display=themes&service=privateparty&set=1&series=1"/>
                    </div>
                </section>
                {
                    ratings.length > 0 && (
                        <section className="size-full md:h-[calc(100vh-140px)] bg-neutral-200 rounded-md">
                            <h3 className="font-headings w-full text-xl font-semibold pt-[20px] pl-6">Service Feedback and Ratings</h3>
                            <div className="w-full md:h-[400px]">
                                <Carousel switchWidth={280}>
                                    {
                                        ratings.map((rate, index) => <RatingCard key={ index } data={ rate } />)
                                    }
                                </Carousel>
                            </div>
                        </section>
                    )
                }                
                <section className="w-full flex flex-col gap-4 md:h-[calc(100vh-140px)]">
                    <h3 className="font-headings w-full text-lg font-semibold leading-none">FAQs</h3>
                    <ol className="space-y-8 list-decimal list-inside font-semibold font-headings">
                        <li>
                            How do I make a reservation for my event?
                            <p className="text-xl !font-thin !font-paragraphs">To make a reservation, simply select your desired package or customize your own. Once you’ve made your choice, click the "Reserve Now" button and complete the booking form. Our team will contact you to confirm the details.</p>
                        </li>
                        <li>
                            Can I customize my catering package?
                            <p className="text-xl !font-thin !font-paragraphs">Absolutely! We offer flexible options so you can tailor the menu, themes, and services to suit your event’s unique needs. Just select the customization option during booking.</p>
                        </li>
                        <li>
                            What types of events do you cater to?
                            <p className="text-xl !font-thin !font-paragraphs">We cater to a wide range of events, including weddings, corporate events, birthdays, anniversaries, and more. Whether you’re hosting an intimate gathering or a large celebration, we’ve got you covered.</p>
                        </li>
                    </ol>
                    <Link href="/faqs" className="w-fit rounded-sm border-[1px] border-neutral-600 p-2 sm:mt-[20px]">Learn More</Link>
                </section>
                <section className="w-full flex flex-col gap-4 md:h-[calc(100vh-140px)]">
                    <h3 className="font-headings text-xl font-bold">Address</h3>
                    <p className="text-xl font-paragraph font-thin">Brgy. Pob.East, General Tinio, Nueva Ecija, Philippines</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7706.400373232661!2d120.68929417770994!3d15.037039700000012!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f7716d5630db%3A0x5c9111d3027fcb02!2sParas%20Catering%20%26%20Events!5e0!3m2!1sen!2sph!4v1723736844581!5m2!1sen!2sph" className="w-full h-[400px] border-2 border-teal-800" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    <button
                        onClick={() => generateGoogleMapsDirection('Paras+Catering,+General+Tinio,+Nueva+Ecija,+Philippines', setAccessMapMessage)}
                        className="button w-[200px] mt-2 text-sm text-white bg-teal-500"
                    >
                        GET DIRECTIONS
                    </button>
                </section>
            </main>
            <FixMiniNavBar />
            <Footer />
            {
                !!accessMapMessage && <ErrorModal header="Geolocation Error" message={accessMapMessage} callback={() => console.log('error')} />
            }
        </div>
    );
}
