'use client';
import Card from '@/components/admin/venues/Card';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { Plus } from '@/components/icons/All';
import { useEffect, useState } from 'react';
import { deleteWithJSON, getData } from '@/utils/send';
import { Prompt, SuccessModal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { zVenue } from '@/stores/admin/venue';

const Venues = () => {
    const [ venues, setVenues ] = useState([]); // database
    const [ venuesObject, setVenuesObject ] = useState({}); // move data to an object
    const [ deletionPrompt, setDeletionPrompt ] = useState(false);
    const [ selectedVenue, setSelectedVenue ] = useState(undefined); // delete functionality needs temporary holder for item the data
    const [ actionSuccessMessage, setActionSuccessMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();
    const saveVenueData = zVenue(state => state.saveVenueData);

    const saveIntoStore = (_k) => {
        const venue = venuesObject[ _k ];
        const savingStatus = saveVenueData({ 
            id: _k,
            name: venue?.name || '',
            price: venue?.price || 0,
            description: venue?.description || '',
            address: venue?.address || {},
            filename: venue?.filename || '',
            maximumSeatingCapacity: venue?.maximumSeatingCapacity || 0,
            chargesForTablesAndChairs: venue?.chargesForTablesAndChairs || 0,
            status: venue?.status || 'available',
        });

        return savingStatus;
    }

    const onDeleteVenue = async () => {
        if(!selectedVenue) return;
        setDeletionPrompt(false);
        setLoading(true);

        const response = await deleteWithJSON('/api/venues', { _k: selectedVenue });
        if(response?.success) {
            setActionSuccessMessage('Venue removed successfully.');
            setTimeout(() => {
                location.reload();
            }, 2000); // to hide modal
        }
    }

    // for updating the venue I dont use the selectedVenue useState since this function is not invoke immediately
    // because if I would set value into setSelectedVenue at first it doesn't mount immediately or not reflec to selectedVenue.
    const onUpdateVenue = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=updatevenue');
        }
    }

    const viewMore = (_k) => {
        if(!_k) return;
        const savingStatus = saveIntoStore(_k);
        if(savingStatus) {
            router.push('/admin?display=viewvenue');
        }
    }

    const getVenues = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/venues')) || { data: [] };
            setVenues(data);

            for(const venue of data) {
                setVenuesObject(prev => ({ ...prev, [ venue?._k ]: venue }));
            }
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getVenues();
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="flex flex-col gap-2 p-4 ">
                <div className="flex justify-between items-center p-1 rounded-lg">
                    <h2 className="font-headings font-semibold">Venues</h2>
                    <Link href="/admin?display=addvenue" className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Add New Venue</span>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    {
                        venues.map((item, index) => (
                            <Card 
                                key={ index } 
                                venueData={ item } 
                                onDelete={ (_k) => { 
                                        setDeletionPrompt(true) 
                                        setSelectedVenue(_k);
                                    }
                                } 
                                onUpdate={ onUpdateVenue }
                                viewMore={ viewMore }
                            />
                        ))
                    }
                </div>
                {
                    venues.length === 0 && 
                        <h3 className="text-neutral-500 font-paragraphs text-lg font-bold mx-auto mt-40">No Venues Found</h3>
                }
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

export default Venues;