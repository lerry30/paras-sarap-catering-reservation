'use client';
import { ArrowLeft } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import { useRouter, useSearchParams } from 'next/navigation';
import { zMenu } from '@/stores/menu';
import CardSelect from '@/components/admin/drinks/CardSelect';
import Loading from '@/components/Loading';

const DrinksSelection = () => {
    const [ drinks, setDrinks ] = useState([]);
    const [ drinkMenu, setDrinkMenu] = useState({});
    const [ loading, setLoading ] = useState(false);

    zMenu.getState().init();

    const router = useRouter();
    const searchParams = useSearchParams();
    const saveDrinksData = zMenu(state => state.saveDrinksData);

    const goBack = () => {
        const action = searchParams?.get('action');
        const actions = { update: 'updatemenu', add: 'addmenu' };
        router.push(`/admin?display=${ actions[action]}`);
    }
    
    const handleSelection = () => {
        // save into store
        const savingStatus = saveDrinksData(drinkMenu);
        if(savingStatus) goBack();
    }

    const getDrinks = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/menus/drinks')) || { data: [] };
            setDrinks(data);
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getDrinks();

        if(Object.keys(zMenu.getState().drinks).length > 0) {
            setDrinkMenu(zMenu.getState().drinks);
        }
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="relative flex flex-col gap-2">
                <div className="sticky w-full top-[var(--nav-height)] left-0 z-navbar border-b-[1px] bg-white flex justify-between items-center py-1 px-4">
                    <div className="flex gap-4">
                        <button onClick={ goBack }>
                            <ArrowLeft />
                        </button>
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
        </>
    );
}

export default DrinksSelection;