'use client';
import Loading from '@/components/Loading';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zDish } from '@/stores/dish';
import { deleteWithJSON } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';

const ViewDish = () => {
    const [ dishName, setDishName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ allergens, setAllergens ] = useState([]);
    const [ costPerHead, setCostPerHead ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const router = useRouter();

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const onDeleteDish = async () => {
        const _k = zDish.getState().id;
        if(!_k) return;
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/dishes', { _k: _k });
        if(response?.success) {
            setActionSuccessMessage('Dish removed successfully.');
            setTimeout(() => setActionSuccessMessage(''), 2000); // to hide modal
            router.push('/admin?display=dishes');
        }
    }

    const onUpdateDish = () => {
        // I'm not saving any data into store since it is already exist
        router.push('/admin?display=updatedish');
    }

    useEffect(() => {
        setDishName(zDish.getState().name);
        setDescription(zDish.getState().description);
        setCostPerHead(zDish.getState().costperhead);
        setAllergens(zDish.getState().allergens);
    }, []);

    return (
        <>
            <section className="p-4">
                { loading && <Loading customStyle="size-full" /> }
                <div className="flex flex-col gap-2 pr-[var(--page-x-padding)]">
                    <div className="w-full flex flex-col justify-center items-center p-2 pb-8 rounded-lg">
                        <h2 className="font-headings text-lg font-semibold">{ dishName }</h2>
                        <span className="w-40 h-[1px] bg-gradient-to-r from-neutral-100 via-neutral-800 to-neutral-100 mt-1"></span>
                    </div>
                    <div className="flex gap-4">
                        <div className="size-96 min-w-96 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                            <Image 
                                src={ zDish.getState().filename }
                                alt=''
                                width={ 400 }
                                height={ 400 }
                                sizes="100%"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                                priority
                            />
                        </div>
                        <div className="grow flex flex-col gap-4">
                            <div className="w-full flex gap-4">
                                <h4 className="font-medium">{ pesoFormatter.format(costPerHead) } per guest served</h4>
                            </div>
                            <div>
                                <p className="text-md text-neutral-600 italic">{ description }</p>
                            </div>
                            {
                                allergens && 
                                <div className="flex flex-col gap-2">
                                    <p className="text-md">It contains ingredients that can cause an allergic reaction.</p>
                                    <ul className="list-disc pl-10 flex flex-col gap-2">
                                        {
                                            allergens.map((item, index) => (
                                                <li key={ index } className="">{ item }</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                            <div className="w-full flex gap-4">
                                <button onClick={ onUpdateDish } className="w-full button shadow-md border border-neutral-500/40 bg-emerald-500/40">Update</button>
                                <button onClick={ () => setDeletionPrompt(true) } className="w-full button shadow-md border border-neutral-500/40 bg-emerald-500/40 hover:bg-red-700 hover:text-white">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
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

export default ViewDish;