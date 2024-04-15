'use client';
import { Plus } from '@/components/icons/All';
import { Prompt, SuccessModal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteWithJSON, getData } from '@/utils/send';
import { zMenu } from '@/stores/menu';

import Link from 'next/link';
import Loading from '@/components/Loading';
import Card from '@/components/admin/menus/Card';

const Menus = () => {
    const [ menus, setMenus ] = useState([]);
    const [ menusObject, setMenusObject ] = useState({});
    const [ selectedMenu, setSelectedMenu] = useState(undefined);

    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();

    const onDeleteMenu = async () => {
        if(!selectedMenu) return;
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/menus', { _k: selectedMenu });
        if(response?.success) {
            setActionSuccessMessage('Menu removed successfully.');
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }
    
    const saveIntoStore = (_k) => {
        const menu = menusObject[_k];
        const { name, description, dishes, drinks, status } = menu;
        zMenu.getState().saveNameNDescription(name, description);
        zMenu.getState().saveDishesData(dishes);
        zMenu.getState().saveDrinksData(drinks);
        zMenu.getState().saveId(_k);
        zMenu.getState().saveStatus(status);
    }

    const onUpdateMenu = (_k) => {
        if(!_k) return;
        saveIntoStore(_k);
        router.push('/admin?display=updatemenu');
    }

    const viewMore = (_k) => {
        if(!_k) return;
        saveIntoStore(_k);
        router.push('/admin?display=viewmenu');
    }
    
    const getMenus = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/menus')) || { data: [] };
            setMenus(data);

            for(const menu of data) {
                setMenusObject(prev => ({ ...prev, [ menu?._k ]: menu }));
            }
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getMenus();
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-2 p-4 ">
                <div className="flex justify-between items-center p-1 rounded-lg">
                    <h2 className="font-headings font-semibold">Menus</h2>
                    <Link href="/admin?display=addmenu" className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Add New Menu</span>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    {
                        menus?.map((menu, index) => (
                            <Card 
                                key={ index } 
                                menuData={ menu } 
                                onDelete={ (_k) => { 
                                    setDeletionPrompt(true) 
                                    setSelectedMenu(_k);
                                }} 
                                onUpdate={ onUpdateMenu }
                                viewMore={ viewMore }
                            />
                        ))
                    }
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

export default Menus;