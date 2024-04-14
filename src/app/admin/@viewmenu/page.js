'use client';
import { Fragment, useEffect, useState } from 'react';
import { zMenu } from '@/stores/admin/menu';
import { useRouter } from 'next/navigation';
import { Prompt, SuccessModal } from '@/components/Modal';
import { deleteWithJSON } from '@/utils/send';
import Image from 'next/image';
import Loading from '@/components/Loading';

const ViewMenu = () => {
    const [ menuName, setMenuName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ listOfDishes, setListOfDishes ] = useState([]);
    const [ listOfDrinks, setListOfDrinks ] = useState([]);
    const [ status, setStatus ] = useState('available');

    const [ loading, setLoading ] = useState(false);
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const router = useRouter();

    zMenu.getState().init();

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const onDeleteMenu = async () => {
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/menus', { _k: zMenu.getState().id });
        if(response?.success) {
            zMenu.getState().clear();
            setActionSuccessMessage('Menu removed successfully.');
            setTimeout(() => {
                router.push('/admin?display=menus');
            }, 1000);
        }
    }

    const onUpdateDrink = () => {
        setLoading(true);
        // I'm not saving any data into store since it is already exist
        router.push('/admin?display=updatemenu');
    }

    useEffect(() => {
        setMenuName(zMenu.getState().name);
        setDescription(zMenu.getState().description);
        setListOfDishes(Object.values(zMenu.getState().dishes || []));
        setListOfDrinks(Object.values(zMenu.getState().drinks || []));
        setStatus(zMenu.getState().status);
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col w-full gap-4">
                <article className="px-4 py-2 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <h3 className="font-headings font-bold text-4xl">{ menuName }</h3>
                        <span className={ `max-h-[18px] text-sm rounded-full px-1 border-[1px] leading-none ${ status === 'available' ? 'bg-green-200/40 text-green-700 border-green-500/40' : 'bg-red-200/40 text-red-700 border-red-500/40' }` }>{ status }</span>
                    </div>
                    <p className="font-paragraphs text-sm">{ description }</p>
                </article>
                <div className="w-full flex justify-around px-4 gap-4">
                    <div className="w-1/2 flex flex-col gap-4 border-r-2">
                        <h3 className="font-headings text-lg font-semibold">Dishes</h3>
                        {
                            listOfDishes?.map((dish, index) => {
                                if(Object.values(dish).length === 0) return <Fragment key={ index } />
                                return <div key={ index } className="flex gap-4 pr-4">
                                        <div className="size-24 min-w-24 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                                            <Image 
                                                src={ dish?.filename }
                                                alt={ dish?.name }
                                                width={ 200 }
                                                height={ 200 }
                                                sizes='100%'
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transformOrigin: 'center',
                                                    borderRadius: '8px 8px 0 0',
                                                }}
                                                priority
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-paragraphs text-lg">{ dish?.name }</h3>
                                            <p className="mx-auto text-sm">{ pesoFormatter.format(dish?.costperhead) } per guest served</p>
                                        </div>
                                        <span className={ `max-h-[20px] text-sm rounded-full px-1 border-[1px] ml-auto leading-none ${ dish?.status === 'available' ? 'bg-green-200/40 text-green-700 border-green-500/40' : 'bg-red-200/40 text-red-700 border-red-500/40' }` }>{ dish.status }</span>
                                    </div>
                                }
                            )
                        }
                    </div>

                    <div className="w-1/2 flex flex-col gap-4">
                        <h3 className="font-headings text-lg font-semibold">Drinks</h3>
                        {
                            listOfDrinks?.map((drink, index) => {
                                if(Object.values(drink).length === 0) return <Fragment key={ index } />
                                return <div key={ index } className="flex gap-4 pr-4">
                                        <div className="size-24 min-w-24 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                                            <Image 
                                                src={ drink?.filename }
                                                alt={ drink?.name }
                                                width={ 200 }
                                                height={ 200 }
                                                sizes='100%'
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transformOrigin: 'center',
                                                    borderRadius: '8px 8px 0 0',
                                                }}
                                                priority
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-paragraphs text-lg">{ drink?.name }</h3>
                                            <p className="mx-auto text-sm">{ pesoFormatter.format(drink?.costperhead) } per guest served</p>
                                        </div>
                                        <span className={ `max-h-[20px] text-sm rounded-full px-1 border-[1px] ml-auto leading-none ${ drink?.status === 'available' ? 'bg-green-200/40 text-green-700 border-green-500/40' : 'bg-red-200/40 text-red-700 border-red-500/40' }` }>{ drink?.status }</span>
                                    </div>
                                }
                            )
                        }
                    </div>
                </div>
                <div className="w-full flex gap-4 p-4">
                    <button onClick={ onUpdateDrink } className="w-28 button shadow-md border border-neutral-500/40 bg-emerald-500/40">Update</button>
                    <button onClick={ () => setDeletionPrompt(true) } className="w-28 button shadow-md border border-neutral-500/40 bg-emerald-500/40 hover:bg-red-700 hover:text-white">Delete</button>
                </div>
            </section>
            {
                deletionPrompt && <Prompt callback={ onDeleteMenu } onClose={ () => setDeletionPrompt(false) } header="Confirm Menu Removal" message="Are you sure you want to remove this menu? Removing it will completely erase all data associated with it and cannot be undone."/>
            }

            {
                !!actionSuccessMessage && <SuccessModal message={ actionSuccessMessage } callback={ () => setActionSuccessMessage('') } />
            }
        </>
    );
}

export default ViewMenu;