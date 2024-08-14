'use client';
import Loading from '@/components/Loading';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zPrivateTheme } from '@/stores/admin/privatetheme';
import { deleteWithJSON } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';

const ViewPrivateThemes = () => {
    const [ themeName, setThemeName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const router = useRouter();

    const onDeletePrivateTheme = async () => {
        const _k = zPrivateTheme.getState().id;
        if(!_k) return;
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/themes/private', { _k: _k });
        if(response?.success) {
            setActionSuccessMessage('Private theme removed successfully.');
            setTimeout(() => setActionSuccessMessage(''), 2000); // to hide modal
            router.push('/admin?display=privatethemes');
        }
    }

    const onUpdatePrivateTheme = () => {
        // I'm not saving any data into store since it is already exist
        router.push('/admin?display=updateprivatetheme');
    }

    useEffect(() => {
        setThemeName(zPrivateTheme.getState().name);
        setDescription(zPrivateTheme.getState().description);
    }, []);

    return (
        <>
            <section className="p-4">
                { loading && <Loading customStyle="size-full" /> }
                <div className="flex flex-col gap-2 pr-[var(--page-x-padding)]">
                    <div className="w-full flex flex-col justify-center items-center p-2 pb-8 rounded-lg">
                        <h2 className="font-headings text-lg font-semibold">{ themeName }</h2>
                        <span className="w-40 h-[1px] bg-gradient-to-r from-neutral-100 via-neutral-800 to-neutral-100 mt-1"></span>
                    </div>
                    <div className="flex gap-4">
                        <div className="size-96 min-w-96 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                            <Image 
                                src={ zPrivateTheme.getState().filename }
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
                            <div>
                                <p className="text-md text-neutral-600 italic">{ description }</p>
                            </div>
                            <div className="w-full flex gap-4">
                                <button onClick={ onUpdatePrivateTheme } className="w-full button shadow-md border border-neutral-500/40 bg-emerald-500/40">Update</button>
                                <button onClick={ () => setDeletionPrompt(true) } className="w-full button shadow-md border border-neutral-500/40 bg-emerald-500/40 hover:bg-red-700 hover:text-white">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {
                deletionPrompt && <Prompt callback={ onDeletePrivateTheme } onClose={ () => setDeletionPrompt(false) } header="Confirm Drink Removal" message="Are you sure you want to remove this theme? Removing it will completely erase all data associated with it and cannot be undone."/>
            }

            {
                !!actionSuccessMessage && <SuccessModal message={ actionSuccessMessage } callback={ () => setActionSuccessMessage('') } />
            }
        </>
    );
}

export default ViewPrivateThemes;
