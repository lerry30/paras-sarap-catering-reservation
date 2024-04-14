'use client';
import Loading from '@/components/Loading';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zVenue } from '@/stores/venue';
import { deleteWithJSON } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';

const ViewVenue = () => {
    const [ venueName, setVenueName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ price, setPrice ] = useState(0);
    const [ chargeForTablesAndChairs, setChargeForTablesAndChairs ] = useState(0);
    const [ maximumSeatingCapacity, setMaximumSeatingCapacity ] = useState(0);
    const [ fullAddress, setFullAddress ] = useState('');

    const [ loading, setLoading ] = useState(false);
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const router = useRouter();

    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const onDeleteVenue = async () => {
        const _k = zVenue.getState().id;
        if(!_k) return;
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/venues', { _k: _k });
        if(response?.success) {
            setActionSuccessMessage('Venue removed successfully.');
            setTimeout(() => setActionSuccessMessage(''), 2000); // to hide modal
            router.push('/admin?display=venues');
        }
    }

    const onUpdateVenue = () => {
        // I'm not saving any data into store since it is already exist
        router.push('/admin?display=updatevenue');
    }

    useEffect(() => {
        setVenueName(zVenue.getState().name);
        setDescription(zVenue.getState().description);
        setPrice(zVenue.getState().price);

        setMaximumSeatingCapacity(zVenue.getState().maximumSeatingCapacity);
        setChargeForTablesAndChairs(zVenue.getState().chargeForTablesAndChairs);

        const { street, barangay, municipality, province } = zVenue.getState().address;

        const fAddress = `${ street }, Brgy. ${ barangay }, ${ municipality }, ${ province }`;
        setFullAddress(fAddress);
    }, []);

    return (
        <>
            <section className="p-4">
                { loading && <Loading customStyle="size-full" /> }
                <div className="flex flex-col gap-2 pr-[var(--page-x-padding)]">
                    <div className="w-full flex flex-col justify-center items-center p-2 pb-8 rounded-lg">
                        <h2 className="font-headings text-lg font-semibold">{ venueName }</h2>
                        <span className="w-40 h-[1px] bg-gradient-to-r from-neutral-100 via-neutral-800 to-neutral-100 mt-1"></span>
                    </div>
                    <div className="flex gap-4">
                        <div className="size-96 min-w-96 flex justify-center items-center rounded-md shadow-lg cursor-pointer border border-neutral-500/40 relative">
                            <Image 
                                src={ zVenue.getState().filename }
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
                                <h4 className="font-paragraphs text-2xl font-bold">{ pesoFormatter.format(price) } per guest served</h4>
                            </div>
                            <div>
                                <p className="font-paragraphs text-md text-neutral-600 italic">{ description }</p>
                            </div>
                            <div className="w-full flex gap-4">
                                <h4 className="font-paragraphs">Maximum Seating Capacity:</h4>
                                <span className="font-paragraphs font-semibold">{ maximumSeatingCapacity }</span>
                            </div>
                            {
                                !!chargeForTablesAndChairs &&
                                    <div className="w-full flex gap-4">
                                        <h4 className="font-paragraphs">Additional Charges for Tables and Chairs:</h4>
                                        <span className="font-headings font-semibold">{ chargeForTablesAndChairs }</span>
                                    </div>
                            }
                            <div className="w-full flex gap-4">
                                <h4 className="font-paragraphs text-lg italic">{ fullAddress }</h4>
                            </div>
                            <div className="w-full flex gap-4">
                                <button onClick={ onUpdateVenue } className="w-full button shadow-md border border-neutral-500/40 bg-emerald-500/40">Update</button>
                                <button onClick={ () => setDeletionPrompt(true) } className="w-full button shadow-md border border-neutral-500/40 bg-emerald-500/40 hover:bg-red-700 hover:text-white">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {
                deletionPrompt && <Prompt callback={ onDeleteVenue } onClose={ () => setDeletionPrompt(false) } header="Confirm Venue Removal" message="Are you sure you want to remove this venue? Removing it will completely erase all data associated with it and cannot be undone."/>
            }

            {
                !!actionSuccessMessage && <SuccessModal message={ actionSuccessMessage } callback={ () => setActionSuccessMessage('') } />
            }
        </>
    );
}

export default ViewVenue;