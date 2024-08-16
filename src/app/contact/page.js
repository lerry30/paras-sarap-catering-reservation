'use client';
import Footer from '@/components/Footer';
import CNavbar from '@/components/client/nav/CNavbar';
import { useState } from 'react';
import { ErrorModal } from '@/components/Modal';
import { generateGoogleMapsDirection } from '@/utils/googleMapsDirection'; 

const Contact = () => {
    const [ accessMapMessage, setAccessMapMessage ] = useState('');

    return <div className="pt-[var(--nav-height)]">
        <CNavbar/>
        <div className="flex flex-col min-h-[calc(100vh-var(--nav-height))] px-page-x py-4">
            <h1 className="font-headings text-xl font-bold">Contact & Address</h1>
            <main className="w-full grow pt-4 flex flex-col md:flex-row">
                <section className="w-full md:w-1/2 flex flex-col gap-8 pt-[40px]"> 
                    <div>
                        <h3 className="font-headings">Phone No.</h3>
                        <span className="text-xl">0928-829-4995</span>
                    </div>
                    <div>
                        <h3 className="font-headings">Email:</h3>
                        <span className="text-xl">parascatering@gmail.com</span>
                    </div>
                    <div>
                        <h3 className="font-headings">Address:</h3>
                        <span className="text-lg">Brgy. Pob.East, General Tinio, Nueva Ecija, Philippines</span>
                    </div>
                    <button
                        onClick={() => generateGoogleMapsDirection('Paras+Catering,+General+Tinio,+Nueva+Ecija,+Philippines', setAccessMapMessage)}
                        className="button w-[200px] mt-2 text-sm text-white bg-teal-500"
                    >
                        GET DIRECTIONS
                    </button>
                </section>
                <section className="w-full md:w-1/2">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7706.400373232661!2d120.68929417770994!3d15.037039700000012!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f7716d5630db%3A0x5c9111d3027fcb02!2sParas%20Catering%20%26%20Events!5e0!3m2!1sen!2sph!4v1723736844581!5m2!1sen!2sph" className="w-full h-[400px] border-2 border-teal-800" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </section>
            </main>
        </div>
        <Footer />
        {
            !!accessMapMessage && <ErrorModal header="Geolocation Error" message={accessMapMessage} callback={() => console.log('error')} />
        }
    </div>
}

export default Contact;


