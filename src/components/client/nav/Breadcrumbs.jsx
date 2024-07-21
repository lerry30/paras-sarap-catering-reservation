'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toNumber } from '@/utils/number';
import { ChevronRight } from '@/components/icons/All';

const Breadcrumbs = ({ step=1, children }) => {
    const [ service, setService ] = useState('');
    const [ setNumber, setSetNumber ] = useState(1);
    const [ linkSet, setLinkSet ] = useState([]);

    const router = useRouter();
    const searchParams = useSearchParams();

    const nStep = toNumber(step);
    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };

    const set1 = [
        '?display=themes',
        '?display=venues',
        '?display=menus',
        '?display=schedule',
        '?display=reviewbudget',
    ];

    const set2 = [
        '?display=themes',
        '?display=providevenuelocation',
        '?display=menus',
        '?display=schedule',
        '?display=reviewbudget',
    ];

    const set3 = [
        '?display=themes',
        '?display=venue',
        '?display=createmenu',
        '?display=schedule',
        '?display=reviewbudget',
    ];

    const set4 = [
        '?display=themes',
        '?display=providevenuelocation',
        '?display=createmenu',
        '?display=schedule',
        '?display=reviewbudget',
    ];

    const stepsName = [ 'theme', 'venue', 'package', 'schedule', 'review' ];
    const sets = [ set1, set2, set3, set4 ];

    useEffect(() => {
        const serviceParam = searchParams.get('service');
        if(!services.hasOwnProperty(serviceParam)) router.push('/');
        setService(serviceParam);

        const setParam = toNumber(searchParams.get('set'));
        const filteredSet = setParam == 0 || setParam > sets.length ? 1 : setParam;
        setSetNumber(filteredSet);

        setLinkSet(sets[filteredSet-1]);
    }, []);

    return (
        <header className="w-full h-[calc(var(--nav-height)-16px)] flex items-center font-headings border-b-[1px] border-neutral-240 fixed top-[var(--nav-height)] left-0 z-navbar bg-white">
            <nav className="w-full py-2">
                <ul className="px-2 sm:px-page-x flex ">
                    <li className="flex gap-4">
                        {
                            linkSet.map((link, index) => {
                                if(nStep <= index) return <div key={ index } className="hidden"></div>; 
                                return (
                                    <Link key={ index } href={ `${ link }&service=${ service }&set=${ setNumber }` } className="flex items-center gap-4">
                                        <span className={ `${ (nStep-1) === index && 'font-semibold' }` }>
                                            { stepsName[index] }
                                        </span>
                                        <ChevronRight strokeWidth={ 1 }/>
                                    </Link>
                                )
                            })
                        }
                    </li>
                    <li className="grow">
                        { children }
                    </li>
                </ul> 
            </nav>
        </header>
    );
}

export default Breadcrumbs;
