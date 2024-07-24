'use client';
import { getSetParam } from '@/utils/client/breadcrumbs/params';
import { ArrowLeft } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import { useRouter, useSearchParams } from 'next/navigation';
import { zMenu } from '@/stores/menu';
import CardSelect from '@/components/drinks/CardSelect';
import Loading from '@/components/Loading';

const DrinksSelection = () => {
    const [ drinks, setDrinks ] = useState([]);
    const [ drinkMenu, setDrinkMenu] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ setParam, setSetParam ] = useState(1); // breadcrumbs
    const [ series, setSeries ] = useState(1); // breadcrumbs

    const router = useRouter();
    const searchParams = useSearchParams();
    const saveDrinksData = zMenu(state => state.saveDrinksData);

    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };

    const goBack = () => {
        const service = searchParams?.get('service');
        if(!services[service]) {
            router.push('/');
            return;
        }
        
        router.push(`/reserve?display=createmenu&service=${ service }&set=${setParam}&series=${series}`);
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

        const filteredSetParam = getSetParam(searchParams);
        setSetParam(filteredSetParam);

        setSeries(searchParams.get('series'));
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="relative flex flex-col gap-4">
                <div className="sticky w-full top-[var(--nav-height)] left-0 z-navbar border-b-[1px] bg-white flex justify-between items-center py-1 px-page-x">
                    <div className="flex gap-4">
                        <button onClick={ goBack }>
                            <ArrowLeft />
                        </button>
                        <h2 className="font-headings font-semibold">Drinks</h2>
                    </div>
                    <button onClick={ handleSelection } className="font-headings bg-skin-ten text-white text-sm font-bold py-2 px-4 rounded-full leading-4">CONTINUE</button>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-page-x">
                    {
                        drinks.map((item, index) => {
                            if(item?.status === 'unavailable') return null;
                            return (
                                <CardSelect
                                    key={ index } 
                                    drinkData={ item } 
                                    drinkMenu={ drinkMenu }
                                    setDrinkMenu={ setDrinkMenu }
                                />
                            )
                        })
                    }
                </div>
            </section>
        </>
    );
}

export default DrinksSelection;
