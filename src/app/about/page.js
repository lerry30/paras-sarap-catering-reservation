// pages/about.js
import Head from 'next/head';

export default function About() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Head>
                <title>About Paras Sarap Catering Services</title>
                <meta name="description" content="Learn about Paras Sarap Catering Services" />
            </Head>

            <h1 className="text-3xl font-bold mb-4">About Paras Sarap Catering Services</h1>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Owner Information</h2>
                <p>
                    <strong>Name:</strong> Glecy Reyes Serrano<br />
                    <strong>Birthday:</strong> February 12, 1967
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Staff Information</h2>
                <p>
                    <strong>No. of Staff:</strong> 2<br />
                    <strong>Staff:</strong> Mitchie Ann Paras Alarcon<br />
                    <strong>Manager:</strong> Mark Chesedh Serrano Paras
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Contact Information</h2>
                <p>
                    <strong>Owner:</strong> 09288294995<br />
                    <strong>Manager:</strong> 09682626466
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Address</h2>
                <p>Poblacion East General Tinio Nueva Ecija</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">History</h2>
                <p>
                    <strong>Build Date:</strong> 2015<br />
                    Paras Sarap Catering Services started as a small business in 2012 by Mrs. Glecy Reyes Serrano. They initially sold different kinds of Filipino foods and street foods. Over time, with their focus on quality and customer service, they expanded to accept bulk orders and eventually entered the catering industry. Today, they are one of the well-known catering businesses in General Tinio and adjacent municipalities, extending their services to Baguio, Pangasinan, and Tarlac.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Statistics</h2>
                <p>
                    <strong>Customers per month:</strong> 10-12<br />
                    <strong>Locations Served:</strong> Around General Tinio (Papaya), Pangasinan, Tarlac, Baguio
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Services Offered</h2>
                <ul className="list-disc pl-4">
                    <li>Rental Equipment - Chairs And tables</li>
                    <li>Food Preparation and Presentation</li>
                    <li>Menu Planning</li>
                    <li>Beverage Services</li>
                    <li>Specialty Services - decor, floral arrangements</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Tagline</h2>
                <p>"Delight in Every Bite: One Reservation at a Time!"</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Themes</h2>
                <p>
                    Paras Sarap Catering Services offers customizable themes, allowing clients to choose colors or themes that suit their venue.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Logo</h2>
                <p>
                    <img src="/path/to/your/custom/logo.png" alt="Paras Sarap Catering Services Logo" className="w-32 h-auto" />
                </p>
            </section>

        </div>
    );
}
