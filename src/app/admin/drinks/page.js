'use client';
import Card from '@/components/admin/drinks/Card';
import Link from 'next/link';
import { Plus } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { deleteWithJSON, getData } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { zDrink } from '@/stores/drink';
import Loading from '@/components/Loading';

const Drinks = () => {
    const [ drinks, setDrinks ] = useState([]);
    const [ drinksObject, setDrinksObject ] = useState({});
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ selectedDrink, setSelectedDrink ] = useState(undefined);
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const saveDrinkData = zDrink(state => state.saveDrinkData);

    const onDeleteDrink = async () => {
        if(!selectedDrink) return;
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/drinks', { _k: selectedDrink });
        if(response?.success) {
            setActionSuccessMessage('Drink removed successfully.');
            setTimeout(() => {
                location.reload();
            }, 2000); // to hide modal
        }
    }

    const saveIntoStore = (_k) => {
        const drink = drinksObject[ _k ];
        const savingStatus = saveDrinkData({ 
            id: _k,
            name: drink?.name || '',
            description: drink?.description || '',
            filename: drink?.filename || '',
            costperhead: drink?.costperhead || 0, 
            status: drink?.status || 'available',
        });

        return savingStatus;
    }

    // for updating the drink I dont use the selectedDrink useState since this function is not invoke immediately
    // because if I would set value into setSelectedDrink at first it doesn't mount immediately or not reflec to selectedDrink.
    const onUpdateDrink = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin/updatedrink');
        }
    }

    const viewMore = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin/viewdrink');
            return;
        }
    }

    const getDrinks = async () => {
        const { data } = (await getData('/api/drinks')) || { data: [] };
        setDrinks(data);

        for(const drink of data) {
            setDrinksObject(prev => ({ ...prev, [ drink?._k ]: drink }));
        }
    }

    useEffect(() => {
        getDrinks();
    }, []);

    return (
        <Suspense fallback={ <Loading customStyle="size-full" /> }>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-2 p-4 ">
                <div className="flex justify-between items-center p-1 rounded-lg">
                    <h2 className="font-headings font-semibold">Drinks</h2>
                    <Link href="/admin/adddrink" className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Add New Drink</span>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    {
                        drinks.map((item, index) => (
                            <Card 
                                key={ index } 
                                drinkData={ item } 
                                onDelete={ (_k) => { 
                                        setDeletionPrompt(true) 
                                        setSelectedDrink(_k);
                                    }
                                } 
                                onUpdate={ onUpdateDrink }
                                viewMore={ viewMore }
                            />
                        ))
                    }
                </div>
            </section>
            {
                deletionPrompt && <Prompt callback={ onDeleteDrink } onClose={ () => setDeletionPrompt(false) } header="Confirm Drink Removal" message="Are you sure you want to remove this drink? Removing it will completely erase all data associated with it and cannot be undone."/>
            }

            {
                !!actionSuccessMessage && <SuccessModal message={ actionSuccessMessage } callback={ () => setActionSuccessMessage('') } />
            }
        </Suspense>
    );
}

export default Drinks;