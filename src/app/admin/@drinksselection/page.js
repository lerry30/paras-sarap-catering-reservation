'use client';
import CardSelect from '@/components/drinks/CardSelect';
import Link from 'next/link';
import { ArrowLeft } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import { useRouter } from 'next/navigation';
import { zMenu } from '@/stores/menu';

const DrinksSelection = () => {
    const [ drinks, setDrinks ] = useState([]);
    const [ drinkMenu, setDrinkMenu] = useState({});

    zMenu.getState().init();

    const router = useRouter();
    const saveDrinksData = zMenu(state => state.saveDrinksData);
    
    const handleSelection = () => {
        // save into store
        const savingStatus = saveDrinksData(drinkMenu);
        if(savingStatus) {
            router.push('/admin?display=addmenu');
        }
    }

    const getDrinks = async () => {
        const { data } = (await getData('/api/menu/drinks')) || { data: [] };
        setDrinks(data);
    }

    useEffect(() => {
        getDrinks();

        if(Object.keys(zMenu.getState().drinks).length > 0) {
            setDrinkMenu(zMenu.getState().drinks);
        }
    }, []);

    return (
        <section className="relative flex flex-col gap-2">
            <div className="sticky w-full top-[var(--nav-height)] left-0 z-navbar border-b-[1px] bg-white flex justify-between items-center py-1 px-4">
                <div className="flex gap-4">
                    <Link href="/admin?display=addmenu">
                        <ArrowLeft />
                    </Link>
                    <h2 className="font-headings font-semibold">Drinks</h2>
                </div>
                <button onClick={ handleSelection } className="font-headings bg-skin-ten text-white text-sm font-bold py-2 px-4 rounded-full leading-4">CONTINUE</button>
            </div>
            <div className="flex flex-wrap gap-2 px-4">
                {
                    drinks.map((item, index) => (
                        <CardSelect
                            key={ index } 
                            drinkData={ item } 
                            drinkMenu={ drinkMenu }
                            setDrinkMenu={ setDrinkMenu }
                        />
                    ))
                }
            </div>
        </section>
    );
}

export default DrinksSelection;