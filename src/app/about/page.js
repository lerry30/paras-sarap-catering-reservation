// pages/about.js
import Footer from '@/components/Footer';
import CNavbar from '@/components/client/nav/CNavbar';
import Logo from '@/components/nav/Logo';

export default function About() {
    return <div className="pt-[var(--nav-height)]">
        <CNavbar/>
        <div className="flex flex-col gap-8 container mx-auto px-4 sm:px-page-x py-8 font-paragraphs">
            <h1 className="font-headings text-xl font-bold sm:mb-4">About Paras Sarap Catering Services</h1>

            <section className="w-full flex flex-col gap-8 sm:flex-row sm:gap-4">
                <article className="w-full flex flex-col gap-4 p-4 border-l-2 border-[var(--skin-ten)] shadow-sm shadow-[var(--skin-ten)]">
                    <h2 className="font-headings text-lg font-bold">Owner Information</h2>
                    <p>
                        Glecy Reyes Serrano<br />
                        February 12, 1967
                    </p>
                </article>

                <article className="w-full flex flex-col gap-4 p-4 border-l-2 border-[var(--skin-ten)] shadow-sm shadow-[var(--skin-ten)]">
                    <h2 className="font-headings text-lg font-bold">Staff Information</h2>
                    <p>
                        <strong>No. of Staff:</strong> 2<br />
                        <strong>Staff:</strong> Mitchie Ann Paras Alarcon<br />
                        <strong>Manager:</strong> Mark Chesedh Serrano Paras
                    </p>
                </article>
            </section>

            <section className="w-full flex flex-col gap-8 sm:flex-row sm:gap-4">
                <article className="w-full p-4 border-l-2 border-[var(--skin-ten)] shadow-sm shadow-[var(--skin-ten)]">
                    <h2 className="font-headings text-lg font-bold mb-2">Contact Information</h2>
                    <p>
                        <strong>Owner:</strong> 09288294995<br />
                        <strong>Manager:</strong> 09682626466
                    </p>
                </article>

                <article className="w-full p-4 border-l-2 border-[var(--skin-ten)] shadow-sm shadow-[var(--skin-ten)]">
                    <h2 className="font-headings text-lg font-bold mb-2">Address</h2>
                    <p>Poblacion East General Tinio Nueva Ecija</p>
                </article>
            </section>

            <section className="flex flex-col p-4 border-[1px]">
                <span>
                    <h2 className="font-headings text-lg font-bold mb-2">History</h2>
                    <strong className="font-headings">Build Date:</strong> 2015<br />
                </span>
                <p>
                    Paras Sarap Catering Services started as a small business in 2012 by Mrs. Glecy Reyes Serrano. They initially sold different kinds of Filipino foods and street foods. Over time, with their focus on quality and customer service, they expanded to accept bulk orders and eventually entered the catering industry. Today, they are one of the well-known catering businesses in General Tinio and adjacent municipalities, extending their services to Baguio, Pangasinan, and Tarlac.
                </p>
            </section>

            <section className="p-4 border-[1px]">
                <h2 className="font-headings text-lg font-bold mb-2">Statistics</h2>
                <p>
                    <strong className="font-headings">Customers per month:</strong> 10-12<br />
                    <strong className="font-headings">Locations Served:</strong> Around General Tinio (Papaya), Pangasinan, Tarlac, Baguio
                </p>
            </section>

            <section className="p-4 border-[1px]">
                <h2 className="font-headings text-lg font-bold mb-2">Services Offered</h2>
                <ul className="list-disc pl-4">
                    <li>Rental Equipment - Chairs And tables</li>
                    <li>Food Preparation and Presentation</li>
                    <li>Menu Planning</li>
                    <li>Beverage Services</li>
                    <li>Specialty Services - decor, floral arrangements</li>
                </ul>
            </section>

            <section className="p-4 border-[1px]">
                <h2 className="font-headings text-lg font-bold mb-2">Tagline</h2>
                <p>"Delight in Every Bite: One Reservation at a Time!"</p>
            </section>

            <section className="p-4 border-[1px]">
                <h2 className="font-headings text-lg font-bold mb-2">Themes</h2>
                <p>
                    Paras Sarap Catering Services offers customizable themes, allowing clients to choose colors or themes that suit their venue.
                </p>
            </section>

            <section className="p-4 border-[1px]">
                <h2 className="font-headings text-lg font-bold mb-2 pb-4">Logo</h2>
                <div className="md:w-[400px]">
                    <Logo />
                </div>
            </section>

        </div>
        <Footer />
    </div>
}
