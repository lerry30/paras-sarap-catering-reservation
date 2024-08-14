'use client';
import Card from '@/components/admin/themes/Card';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { Plus } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { deleteWithJSON, getData } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { zKidTheme } from '@/stores/admin/kidtheme';

const KidThemes = () => {
    const [ kidThemes, setKidThemes ] = useState([]); // database
    const [ themesObject, setThemesObject ] = useState({}); // move data to an object
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ selectedTheme, setSelectedTheme ] = useState(undefined); // delete functionality needs temporary holder for item the data
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const saveKidThemeData = zKidTheme(state => state.saveKidThemeData);

    const saveIntoStore = (_k) => {
        const theme = themesObject[ _k ];
        const savingStatus = saveKidThemeData({ 
            id: _k,
            name: theme?.name || '',
            description: theme?.description || '',
            filename: theme?.filename || '',
        });

        return savingStatus;
    }

    const onDeleteKidTheme = async () => {
        if(!selectedTheme) return;
        setDeletionPrompt(false);
        setLoading(true);

        console.log(selectedTheme);
        const response = await deleteWithJSON('/api/themes/kid', { _k: selectedTheme });
        if(response?.success) {
            setActionSuccessMessage('Kid theme removed successfully.');
            setTimeout(() => {
                location.reload();
            }, 2000); // to hide modal
        }
    }

    const onUpdateTheme = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=updatekidtheme');
        }
    }

    const viewMore = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=viewkidtheme');
        }
    }

    const getKidThemes = async () => {
        try {
            setLoading(true);
            const { data } = (await getData('/api/themes/kid')) || { data: [] };
            setKidThemes(data);

            for(const theme of data) {
                setThemesObject(prev => ({ ...prev, [ theme?._k ]: theme }));
            }
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getKidThemes();
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-2 p-4 bg-neutral-100">
                <div className="flex justify-between items-center p-1 rounded-lg">
                    <h2 className="font-headings font-semibold">Kid Themes</h2>
                    <Link href="/admin?display=addkidtheme" className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Add New Theme</span>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    {
                        kidThemes.map((item, index) => (
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
                    kidThemes.length === 0 && 
                        <h3 className="text-neutral-500 font-paragraphs text-lg font-bold mx-auto mt-40">No Kid Themes Found</h3>
                }
            </section>
            {
                deletionPrompt && <Prompt callback={ onDeleteKidTheme } onClose={ () => setDeletionPrompt(false) } header="Confirm Kid Theme Removal" message="Are you sure you want to remove this theme? Removing it will completely erase all data associated with it and cannot be undone."/>
            }

            {
                !!actionSuccessMessage && <SuccessModal message={ actionSuccessMessage } callback={ () => setActionSuccessMessage('') } />
            }
        </>
    );
}

export default KidThemes;
