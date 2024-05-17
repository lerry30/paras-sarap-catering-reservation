'use client';
import CardSelect from '@/components/dishes/CardSelect';
import Loading from '@/components/Loading';
import { ArrowLeft } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import { useRouter, useSearchParams } from 'next/navigation';
import { zMenu } from '@/stores/menu';

const DishesSelection = () => {
    const [ dishes, setDishes ] = useState([]);
    const [ dishMenu, setDishMenu] = useState({});
    const [ loading, setLoading ] = useState(false);

    zMenu.getState().init();

    const router = useRouter();
    const searchParams = useSearchParams();
    const saveDishesData = zMenu(state => state.saveDishesData);

    const goBack = () => {
        const action = searchParams?.get('action');
        const actions = { update: 'updatemenu', add: 'addmenu' };
        router.push(`/admin?display=${ actions[action]}`);
    }
    
    const handleSelection = () => {
        // save into store
        const savingStatus = saveDishesData(dishMenu);
        if(savingStatus) goBack();
    }

    const getDishes = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/menus/dishes')) || { data: [] };
            setDishes(data);
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getDishes();

        if(Object.keys(zMenu.getState().dishes).length > 0) {
            setDishMenu(zMenu.getState().dishes);
        }
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="relative flex flex-col gap-4">
                <div className="sticky w-full top-[var(--nav-height)] left-0 z-navbar border-b-[1px] bg-white flex justify-between items-center py-1 px-4">
                    <div className="flex gap-4">
                        <button onClick={ goBack }>
                            <ArrowLeft />
                        </button>
                        <h2 className="font-headings font-semibold">Dishes</h2>
                    </div>
                    <button onClick={ handleSelection } className="font-headings bg-skin-ten text-white text-sm font-bold py-2 px-4 rounded-full leading-4">CONTINUE</button>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4">
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
        </>
    );
}

export default DishesSelection;