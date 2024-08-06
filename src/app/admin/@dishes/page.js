'use client';
import Card from '@/components/admin/dishes/Card';
import Link from 'next/link';
import { Plus } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { deleteWithJSON, getData } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { zDish } from '@/stores/admin/dish';
import Loading from '@/components/Loading';

const Dishes = () => {
    const [ dishes, setDishes ] = useState([]);
    const [ dishesObject, setDishesObject ] = useState({});
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ selectedDish, setSelectedDish ] = useState(undefined);
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const saveDishData = zDish(state => state.saveDishData);

    const saveIntoStore = (_k) => {
        const dish = dishesObject[ _k ];
        const savingStatus = saveDishData({ 
            id: _k,
            name: dish?.name || '',
            description: dish?.description || '',
            allergens: dish?.allergens || [],
            filename: dish?.filename || '',
            costperhead: dish?.costperhead || 0,
            status: dish?.status || 'available',
        });

        return savingStatus;
    }

    const onDeleteDish = async () => {
        if(!selectedDish) return;
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/dishes', { _k: selectedDish });
        if(response?.success) {
            setActionSuccessMessage('Dish removed successfully.');
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }

    // for updating the dish I dont use the selectedDish useState since this function is not invoke immediately
    // because if I would set value into setSelectedDish at first it doesn't mount immediately or not reflec to selectedDish.
    const onUpdateDish = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=updatedish');
            return;
        }
    }

    const viewMore = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=viewdish');
        }
    }

    const getDishes = async () => {
        setLoading(true);
        try {
            const { data } = (await getData('/api/dishes')) || { data: [] };
            setDishes(data);

            for(const dish of data) {
                setDishesObject(prev => ({ ...prev, [ dish?._k ]: dish }));
            }
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getDishes();
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-2 p-4 bg-neutral-100">
                <div className="flex justify-between items-center p-1 rounded-lg">
                    <h2 className="font-headings font-semibold">Dishes</h2>
                    <Link href="/admin?display=adddish" className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Add New Dish</span>
                    </Link>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                    {
                        dishes.map((item, index) => (
                            <Card 
                                key={ index } 
                                dishData={ item } 
                                onDelete={ (_k) => { 
                                        setDeletionPrompt(true) 
                                        setSelectedDish(_k);
                                    }
                                } 
                                onUpdate={ onUpdateDish }
                                viewMore={ viewMore }
                            />
                        ))
                    }
                </div>
                {
                    dishes.length === 0 && 
                        <h3 className="text-neutral-500 font-paragraphs text-lg font-bold mx-auto mt-40">No Dishes Found</h3>
                }
            </section>
            {
                deletionPrompt && <Prompt callback={ onDeleteDish } onClose={ () => setDeletionPrompt(false) } header="Confirm Dish Removal" message="Are you sure you want to remove this dish? Removing it will completely erase all data associated with it and cannot be undone."/>
            }

            {
                !!actionSuccessMessage && <SuccessModal message={ actionSuccessMessage } callback={ () => setActionSuccessMessage('') } />
            }
        </>
    );
}

export default Dishes;
