'use client';
import CardSelect from '@/components/dishes/CardSelect';
import Link from 'next/link';
import { ArrowLeft } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import { useRouter } from 'next/navigation';
import { zMenu } from '@/stores/menu';

const DishesSelection = () => {
    const [ dishes, setDishes ] = useState([]);
    const [ dishMenu, setDishMenu] = useState({});

    zMenu.getState().init();

    const router = useRouter();
    const saveDishesData = zMenu(state => state.saveDishesData);
    
    const handleSelection = () => {
        // save into store
        const savingStatus = saveDishesData(dishMenu);
        if(savingStatus) {
            router.push('/admin?display=addmenu');
        }
    }

    const getDishes = async () => {
        const { data } = (await getData('/api/menu/dishes')) || { data: [] };
        setDishes(data);
    }

    useEffect(() => {
        getDishes();

        if(Object.keys(zMenu.getState().dishes).length > 0) {
            setDishMenu(zMenu.getState().dishes);
        }
    }, []);

    return (
        <section className="relative flex flex-col gap-2">
            <div className="sticky w-full top-[var(--nav-height)] left-0 z-navbar border-b-[1px] bg-white flex justify-between items-center py-1 px-4">
                <div className="flex gap-4">
                    <Link href="/admin?display=addmenu">
                        <ArrowLeft />
                    </Link>
                    <h2 className="font-headings font-semibold">Dishes</h2>
                </div>
                <button onClick={ handleSelection } className="font-headings bg-skin-ten text-white text-sm font-bold py-2 px-4 rounded-full leading-4">CONTINUE</button>
            </div>
            <div className="flex flex-wrap gap-2 px-4">
                {
                    dishes.map((item, index) => (
                        <CardSelect
                            key={ index } 
                            dishData={ item } 
                            dishMenu={ dishMenu }
                            setDishMenu={ setDishMenu }
                        />
                    ))
                }
            </div>
        </section>
    );
}

export default DishesSelection;