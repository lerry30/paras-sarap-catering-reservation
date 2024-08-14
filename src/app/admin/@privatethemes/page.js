'use client';
import Card from '@/components/admin/themes/Card';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { Plus } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { deleteWithJSON, getData } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { zPrivateTheme } from '@/stores/admin/privatetheme';

const PrivateThemes = () => {
    const [ privateThemes, setPrivateThemes ] = useState([]); // database
    const [ themesObject, setThemesObject ] = useState({}); // move data to an object
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ selectedTheme, setSelectedTheme ] = useState(undefined); // delete functionality needs temporary holder for item the data
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const savePrivateThemeData = zPrivateTheme(state => state.savePrivateThemeData);

    const saveIntoStore = (_k) => {
        const theme = themesObject[ _k ];
        const savingStatus = savePrivateThemeData({ 
            id: _k,
            name: theme?.name || '',
            description: theme?.description || '',
            filename: theme?.filename || '',
        });

        return savingStatus;
    }

    const onDeletePrivateTheme = async () => {
        if(!selectedTheme) return;
        setDeletionPrompt(false);
        setLoading(true);

        console.log(selectedTheme);
        const response = await deleteWithJSON('/api/themes/private', { _k: selectedTheme });
        if(response?.success) {
            setActionSuccessMessage('Private theme removed successfully.');
            setTimeout(() => {
                location.reload();
            }, 2000); // to hide modal
        }
    }

    const onUpdateTheme = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=updateprivatetheme');
        }
    }

    const viewMore = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=viewprivatetheme');
        }
    }

    const getPrivateThemes = async () => {
        try {
            setLoading(true);
            const { data } = (await getData('/api/themes/private')) || { data: [] };
            setPrivateThemes(data);

            for(const theme of data) {
                setThemesObject(prev => ({ ...prev, [ theme?._k ]: theme }));
            }
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getPrivateThemes();
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-2 p-4 bg-neutral-100">
                <div className="flex justify-between items-center p-1 rounded-lg">
                    <h2 className="font-headings font-semibold">Private Themes</h2>
                    <Link href="/admin?display=addprivatetheme" className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Add New Theme</span>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    {
                        privateThemes.map((item, index) => (
                            <Card
                                key={ index } 
                                themeData={ item } 
                                onDelete={ (_k) => { 
                                        setDeletionPrompt(true) 
                                        setSelectedTheme(_k);
                                    }
                                } 
                                onUpdate={ onUpdateTheme }
                                viewMore={ viewMore }
                            />
                        ))
                    }
                </div>
                {
                    privateThemes.length === 0 && 
                        <h3 className="text-neutral-500 font-paragraphs text-lg font-bold mx-auto mt-40">No Private Themes Found</h3>
                }
            </section>
            {
                deletionPrompt && <Prompt callback={ onDeletePrivateTheme } onClose={ () => setDeletionPrompt(false) } header="Confirm Private Theme Removal" message="Are you sure you want to remove this theme? Removing it will completely erase all data associated with it and cannot be undone."/>
            }

            {
                !!actionSuccessMessage && <SuccessModal message={ actionSuccessMessage } callback={ () => setActionSuccessMessage('') } />
            }
        </>
    );
}

export default PrivateThemes;
