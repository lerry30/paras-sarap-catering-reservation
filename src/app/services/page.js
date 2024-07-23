'use client';

import WeddingImg from '../../../public/wedding.jpg';
import DebutImg from '../../../public/debut.jpeg';
import KidsPartyImg from '../../../public/kids-party.jpg';
import PrivatePartyImg from '../../../public/private-party.jpeg';
import Card from '@/components/client/services/Card';
import CNavbar from '@/components/client/nav/CNavbar';
import Footer from '@/components/Footer';

const Services = () => {
    return <div className="pt-[var(--nav-height)]">
        <CNavbar />
        <main className="mb-4">
            <section className="w-screen min-h-screen flex justify-center items-center">
                <div className="w-full flex flex-col px-page-x md:px-4 py-4 md:min-h-[calc(100vh-var(--nav-height)-32px)]">
                    <h3 className="font-headings w-full text-center text-lg font-semibold leading-none">Services</h3>
                    <p className="font-paragraphs w-full text-center text-neutral-700 text-sm">Choose Service</p>
                    <div className="w-full flex justify-center gap-4 mt-4 flex-wrap">
                        <Card name="Wedding Service" image={ WeddingImg } description="Elevate your special day to unforgettable heights with our bespoke wedding services. From enchanting venues to exquisite decor and flawless execution, let us transform your dream wedding into a reality." link="/reserve?display=themes&service=wedding&set=1&series=1"/>
                        <Card name="Debut Service" image={ DebutImg } description="Celebrate your debut in style with our curated debutante services. From elegant venues to personalized themes and seamless coordination, let us make your debut an occasion to remember." link="/reserve?display=themes&service=debut&set=1&series=1"/>
                        <Card name="Kids Party Service" image={ KidsPartyImg } description="Create magical memories for your little ones with our vibrant kids party services. From exciting themes to engaging entertainment and delightful treats, let us bring joy and laughter to your child's special day." link="/reserve?display=themes&service=kidsparty&set=1&series=1"/>
                        <Card name="Private Party Service" image={ PrivatePartyImg } description="Host an unforgettable private party with our exclusive services. From intimate gatherings to lavish celebrations, our experienced team will tailor every detail to exceed your expectations and create lasting memories." link="/reserve?display=themes&service=privateparty&set=1&series=1"/>
                    </div>
                </div>
            </section>
        </main>
        <Footer/>
    </div>
}

export default Services;
