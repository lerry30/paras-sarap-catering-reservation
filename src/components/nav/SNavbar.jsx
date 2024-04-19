import { ArrowLeft } from '@/components/icons/All';
import Link from 'next/link';

const SNavbar = ({ href='/', headerClassName='', navClassName='' }) => {
    return (
        <header className={ `w-full h-nav-height flex items-center font-headings border-b-[1px] border-neutral-240 sticky top-0 left-0 z-navbar backdrop-blur-sm ${ headerClassName }` }>
            <nav className={ `w-full py-2 ${ navClassName }` }>
                <ul className="px-2 sm:px-page-x flex">
                    <li className="">
                        <Link href={ href } className="flex items-center gap-4">
                            <ArrowLeft />
                            <span>Back</span>
                        </Link>
                    </li>
                </ul> 
            </nav>
        </header>
    );
}

export default SNavbar;