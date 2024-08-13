import Link from 'next/link';
import LogoWhite from '@/components/LogoWhite';
//import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-white py-10 px-page-x relative z-footer mt-10">
            {/*<div className="container mx-auto flex flex-wrap justify-between items-start gap-y-10">
                <div className="w-full sm:w-[30%]">
                    <Link href="/">
                        <span><LogoWhite className="w-full" /></span>
                    </Link>
                </div>
                <div className="w-full sm:w-[30%]">
                    <h2 className="font-bold text-lg mb-4">About Us</h2>
                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about">
                                    <span className="text-neutral-300 hover:text-white">About</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact">
                                    <span className="text-neutral-300 hover:text-white">Contact</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="w-full sm:w-[30%]">
                    <h2 className="font-bold text-lg mb-4">Services</h2>
                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/reserve?display=themes&service=wedding&set=1&series=1">
                                    <span className="text-neutral-300 hover:text-white">Wedding</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/reserve?display=themes&service=debut&set=1&series=1">
                                    <span className="text-neutral-300 hover:text-white">Debut</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/reserve?display=themes&service=kidsparty&set=1&series=1">
                                    <span className="text-neutral-300 hover:text-white">Kids Party</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/reserve?display=themes&service=privateparty&set=1&series=1">
                                    <span className="text-neutral-300 hover:text-white">Private Party</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="w-full sm:w-[30%]">
                    <h2 className="font-bold text-lg mb-4">Contact Us</h2>
                    <div className="space-y-2">
                        <div>
                            <h3 className="font-semibold">Phone No.</h3>
                            <span className="text-neutral-300">0928-829-4995</span>
                        </div>
                        <div>
                            <h3 className="font-semibold">Email:</h3>
                            <span className="text-neutral-300">parascatering@gmail.com</span>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-[30%]">
                    <h2 className="font-bold text-lg mb-4">Follow Us</h2>
                    <div className="flex space-x-4">
                        <Link href="https://www.facebook.com/4Mparas">
                            <span className="text-neutral-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={24} />
                            </span>
                        </Link>
                        <Link href="https://twitter.com">
                            <span className="text-neutral-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={24} />
                            </span>
                        </Link>
                        <Link href="https://instagram.com">
                            <span className="text-neutral-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={24} />
                            </span>
                        </Link>
                        <Link href="https://linkedin.com">
                            <span className="text-neutral-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={24} />
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="w-full sm:w-[30%]">
               {/*     <h2 className="font-bold text-lg mb-4">Subscribe to Our Newsletter</h2>
                    <form className="space-y-2">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full p-2 rounded bg-neutral-800 text-white focus:outline-none"
                        />
                        <button className="w-full p-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                            Subscribe
                        </button>
                    </form>
                */}
            {/*                </div>
            </div>
            <div className="mt-10 text-center text-neutral-500">
                <p>&copy; {new Date().getFullYear()} Paras Sarap Catering. All rights reserved.</p>
            </div> */}
        </footer>
    );
};

export default Footer;
