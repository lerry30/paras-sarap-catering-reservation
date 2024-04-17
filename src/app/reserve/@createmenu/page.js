'use client';
import Loading from '@/components/Loading';
import ErrorField from '@/components/ErrorField';
import Image from 'next/image';
import { Plus, X } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { emptyMenuFields } from '@/utils/client/emptyValidation';
import { sendForm } from '@/utils/send';
import { handleError } from '@/utils/auth/backendError';
import { useRouter, useSearchParams } from 'next/navigation';
import { zMenu } from '@/stores/menu';
import { zReservation } from '@/stores/reservation';
import { Prompt } from '@/components/Modal';

const CreateMenu = () => {
    const [ menuName, setMenuName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ dishMenu, setDishMenu ] = useState({});
    const [ drinkMenu, setDrinkMenu ] = useState({});
    const [ preview, setPreview ] = useState({});
    const [ service, setService ] = useState(undefined);

    const removeDish = zMenu(state => state.removeDish);
    const removeDrink = zMenu(state => state.removeDrink);
    const clearAllData = zMenu(state => state.clear);

    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ confirmationPrompt, setConfirmationPrompt ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };
    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const checkMenuData = () => {
        setInvalidFieldsValue({});

        const invalidFields = emptyMenuFields(Object.keys(dishMenu), Object.keys(drinkMenu));
        for(const [field, message] of Object.entries(invalidFields))
            setInvalidFieldsValue(prev => ({ ...prev, [field]: message }));

        if(Object.values(invalidFields).length === 0) {
            setConfirmationPrompt(true);
        }
    }

    const saveClientCreatedMenu = () => {
        setLoading(true);
        try {
            const menuData = {
                name: menuName,
                description,
                dishMenu,
                drinkMenu,
            };

            zReservation.getState().saveMenuData(menuData);
            clearAllData();
            router.push(`/reserve?display=schedule&service=${ service }`);
        } catch(error) {
            setInvalidFieldsValue(prev => ({ ...prev, unauth: 'There\'s something wrong!' }));
        }

        setLoading(false);
    }

    const previewItem = (ev, data) => {
        // const children = ev.target?.parentElement?.children || [];
        // const currentElem = ev.target.closest('li');

        // for(const child of children) {
        //     child.style.backgroundColor = 'white';
        // }

        // currentElem.style.backgroundColor = 'rgb(212, 212, 212)';
        setPreview(data);
    }

    const removeItemFromDishTable = (ev, _id) => {
        ev.stopPropagation();

        removeDish(_id);
        setDishMenu(zMenu.getState().dishes);

        if(preview?._id === _id)
            setPreview({});

        location.reload();
    }

    const removeItemFromDrinkTable = (ev, _id) => {
        ev.stopPropagation();

        removeDrink(_id);
        setDrinkMenu(zMenu.getState().drinks);

        if(preview?._id === _id)
            setPreview({});

        location.reload();
    }

    const saveNameNDescThenAdd = (ev, path) => {
        ev.preventDefault();
        zMenu.getState().saveNameNDescription(menuName, description);
        router.push(path + '&action=add&service=' + service);
    }

    useEffect(() => {
        setMenuName(zMenu.getState().name);
        setDescription(zMenu.getState().description);
        setDishMenu(zMenu.getState().dishes);
        setDrinkMenu(zMenu.getState().drinks);
        
        const serviceParam = searchParams.get('service');
        if(!services[serviceParam]) router.push('/');
        setService(serviceParam);
    }, []);

    return (
        <section className="flex flex-col px-4 pt-1">
            { loading && <Loading customStyle="size-full" /> }
            <div className="flex justify-between items-center p-1 rounded-lg">
                <h2 className="font-headings font-semibold">Create New Menu</h2>
            </div>
            <div className="flex gap-4 font-paragraphs min-h-[340px] border-y-[1px]">
                <div className="flex grow max-h-[340px] pt-2 divide-x-2 border-r-[1px]">
                    <div className="w-full flex flex-col gap-2 p-2">
                        <header className="flex justify-between">
                            <h2 className="font-headings font-bold text-xl">Dishes</h2>
                            <button onClick={ ev => saveNameNDescThenAdd(ev, '/reserve?display=dishesselection') } className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                                <Plus size={20} />
                                <span className="text-sm font-medium">Add New</span>
                            </button>
                        </header>
                        <div className="overflow-auto">
                            <ul className="divide-y-2">
                                {
                                    Object.values(dishMenu || {}).map((dish, index) => (
                                        <li key={ index } onClick={ ev => previewItem(ev, dish) } className="flex justify-between items-center cursor-pointer pl-1 pr-2 hover:bg-neutral-300">
                                            <span className="py-2">{ dish?.name }</span>
                                            <div onClick={ ev => removeItemFromDishTable(ev, dish?._id) } className="rounded-full">
                                                <X size={18} className="size-[18px] rounded-full hover:bg-red-300/40 hover:stroke-red-600 cursor-pointer"/>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <ErrorField message={ invalidFieldsValue['dishes'] }/>
                    </div>
                    <div className="w-full flex flex-col gap-2 p-2">
                        <header className="flex justify-between">
                            <h2 className="font-headings font-bold text-xl">Drinks</h2>
                            <button onClick={ ev => saveNameNDescThenAdd(ev, '/reserve?display=drinksselection') } className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                                <Plus size={20} />
                                <span className="text-sm font-medium">Add New</span>
                            </button>
                        </header>
                        <div className="overflow-auto">
                            <ul className="divide-y-2">
                                {
                                    Object.values(drinkMenu || {}).map((drink, index) => (
                                        <li key={ index } onClick={ ev => previewItem(ev, drink) } className="flex justify-between items-center cursor-pointer pl-1 pr-2 hover:bg-neutral-300">
                                            <span className="py-2">{ drink?.name }</span>
                                            <div onClick={ ev => removeItemFromDrinkTable(ev, drink?._id) }>
                                                <X size={18} className="size-[18px] rounded-full hover:bg-red-300/40 hover:stroke-red-600 cursor-pointer"/>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <ErrorField message={ invalidFieldsValue['drinks'] }/>
                    </div>
                </div>  
                <div className="flex flex-col gap-4 py-4 w-1/3">
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Menu Name (Optional)</label>
                        <input name="menuname" value={ menuName } onChange={(e) => setMenuName(e.target.value)} className="input w-full border border-neutral-500/40" placeholder="Menu Name (Optional)" />
                        <ErrorField message={ invalidFieldsValue['menuname'] }/>
                    </div>
                    <div>
                        <label className="font-paragraph text-sm font-semibold">Desciption (Optional)</label>
                        <textarea name="description" value={ description } onChange={(e) => setDescription(e.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Description (Optional)"></textarea>
                        <ErrorField message={ invalidFieldsValue['description'] }/>
                    </div>
                    <div className="w-full flex gap-4">
                        <button onClick={ checkMenuData } className="w-1/2 button shadow-md border border-neutral-500/40">Save</button>
                        <button onClick={ (ev) => {
                            ev.preventDefault();
                            router.push(`/reserve?display=menus&service=${ service }`)
                        }} className="w-1/2 button shadow-md border border-neutral-500/40">
                            Cancel
                        </button>
                    </div>
                    <ErrorField message={ invalidFieldsValue['unauth'] }/>
                </div> 
            </div>
            <div className="w-full h-[calc(100vh-var(--nav-height)-380px)] flex justify-center items-center">
                {
                    Object.values(preview).length === 0 ?
                        <h1 className="font-headings font-bold text-xl text-neutral-900/70">Preview</h1>
                    :
                        <div className="flex items-center gap-2">
                            <div className="size-36 min-w-36 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                                <Image 
                                    src={ preview?.filename }
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
                            <div className="grow flex flex-col gap-1">
                                <div className="w-full flex">
                                    <h4 className="font-medium">{ preview.name }</h4>
                                </div>
                                <div className="w-full flex">
                                    <h4 className="text-sm font-medium">{ pesoFormatter.format(preview?.costperhead) } per guest served</h4>
                                </div>
                                <div>
                                    <p className={ `text-sm text-neutral-600 italic ${ (preview?.allergens || []).length > 0 && 'max-w-md' }` }>{ preview?.description }</p>
                                </div>
                            </div>
                            {
                                (preview?.allergens || []).length > 0 && 
                                    <div className="flex flex-col gap-1 ml-2">
                                        <p className="font-paragraphs text-sm">It contains ingredients that can cause an allergic reaction.</p>
                                        <ul className="list-disc pl-10 flex flex-col gap-2">
                                            {
                                                (preview || []).allergens.map((item, index) => (
                                                    <li key={ index } className="font-paragraphs text-sm">{ item }</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                            }
                        </div>
                }
            </div>
            {
                confirmationPrompt && <Prompt callback={ saveClientCreatedMenu } onClose={ () => setConfirmationPrompt(false) } header="Confirm Your Custom Menu for the Event"
                    message={ `Are you sure you want your custom menu to be the menu for the event?` }
                />
            }
        </section>
    );
}

export default CreateMenu;