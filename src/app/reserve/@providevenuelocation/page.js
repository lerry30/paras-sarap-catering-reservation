'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { addressAll } from '@/utils/philAddress';
import { regions } from '@/utils/philAddress';
import { toNumber } from '@/utils/number';
import { zReservation } from '@/stores/reservation';
import { emptyVenueFields } from '@/utils/client/emptyValidation';
import { Prompt } from '@/components/Modal';
import ErrorField from '@/components/ErrorField';
import Checkbox from '@/components/Checkbox';
import Loading from '@/components/Loading';
import Link from 'next/link';

const Venues = () => {
    const [ venueName, setVenueName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ tablesNChairsProvided, setTablesNChairsProvided ] = useState(false);
    const [ noOfGuest, setNoOfGuest ] = useState(0);
    const [ service, setService ] = useState(undefined);
    const [ loading, setLoading ] = useState(false);
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ confirmationPrompt, setConfirmationPrompt ] = useState('');

    const [ selectedAddress, setSelectedAddress ] = useState({ street: '', region: '', province: '', municipality: '', barangay: '' });
    const [ listOfProvince, setListOfProvince ] = useState([]);
    const [ listOfMunicipality, setListOfMunicipality ] = useState([]);
    const [ listOfBarangay, setListOfBarangay ] = useState([]);

    const searchParams = useSearchParams();
    const router = useRouter();

    const saveProvidedVenueInfo = async () => {
        setInvalidFieldsValue({});
        setLoading(true);

        const { street, region, province, municipality, barangay } = selectedAddress;
        const invalidFields = emptyVenueFields(region, province, municipality, barangay, street);
        for(const [field, message] of Object.entries(invalidFields))
            setInvalidFieldsValue(prev => ({ ...prev, [field]: message }));

        if(!noOfGuest) setInvalidFieldsValue(prev => ({ ...prev, noofguest: 'Enter a numerical value greater than zero for the number of guest' }));

        if(Object.values(invalidFields).length === 0) {
            try {
                const venueData = {
                    name: venueName,
                    description,
                    tablesnchairsprovided: tablesNChairsProvided,
                    noofguest: noOfGuest,
                    address: {
                        region, 
                        province, 
                        municipality, 
                        barangay, 
                        street
                    }
                };

                zReservation.getState().saveVenueData(venueData);
                router.push(`/reserve?display=menus&service=${ service }`);
            } catch(error) {
                setInvalidFieldsValue(prev => ({ ...prev, unauth: 'There\'s something wrong!' }));
            }
        }

        setLoading(false);
    }

    const guestNoInput = (ev) => {
        const value = ev.target.value;
        const noOfGuest = toNumber(value);
        ev.target.value = noOfGuest;
        setNoOfGuest(noOfGuest);

        if(isNaN(Number(value))) setInvalidFieldsValue(prev => ({ ...prev, noofguest: 'Please enter a numerical value for the number of guest.' }));
    }

    const select = (ev, key) => {
        const selected = ev.target.value;
        setSelectedAddress(state => ({ ...state, [key]: selected }));
        ({
            region: () => {
                setListOfProvince(Object.keys(addressAll[selected]?.province || {}));
                // reset
                setListOfMunicipality([]);
                setListOfBarangay([]);
            },
            province: () => {
                setListOfMunicipality(Object.keys(addressAll[selectedAddress.region]?.province[selected]?.municipality || {}))
                // reset
                setListOfBarangay([]);
            },
            municipality: () => setListOfBarangay(addressAll[selectedAddress.region]?.province[selectedAddress.province]?.municipality[selected].barangay || {})
        })[key]();
    }

    useEffect(() => {
        const serviceParam = searchParams.get('service');
        setService(serviceParam);
    }, []);

    return (
        <section className="w-full flex flex-col pt-4 px-page-x">
            { loading && <Loading customStyle="size-full" /> }
            <div className="flex justify-between items-center p-1 rounded-lg">
                <h2 className="font-headings font-semibold">Add Your Venue</h2>
            </div>
            <div className="font-paragraphs grow flex py-2 gap-4">
                <div className="w-1/2 flex flex-col gap-4" >
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Venue Name (Optional)</label>
                        <input name="venuename" id="venuename" onChange={(ev) => setVenueName(ev.target.value)} className="input w-full border border-neutral-500/40" placeholder="Venue Name (Optional)" />
                        <ErrorField message={ invalidFieldsValue['venuename'] }/>
                    </div>
                    <div>
                        <label className="font-paragraph text-sm font-semibold">Description (Optional)</label>
                        <textarea name="description" onChange={(ev) => setDescription(ev.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Description (Optional)"></textarea>
                        <ErrorField message={ invalidFieldsValue['description'] }/>
                    </div>
                    <div className="size-full p-4 bg-blue-400/50 rounded-lg flex justify-center items-center">
                        <article className="w-4/5 font-paragraphs text-sm text-center ">
                            <span className="font-semibold">Note:&nbsp;</span>
                            <span>It's essential to provide the precise location of your event. This ensures that our team can promptly prepare and plan the setup, including any necessary tools and equipment. Your detailed location information enables us to deliver a seamless and tailored experience, ensuring everything is in place for a successful event.
                            </span>
                        </article>
                    </div>
                </div>
                <div className="w-1/2 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <p className="text-sm font-paragraphs">By checking the box below, you confirm that you will provide the chairs and tables needed for the event. In addition to providing the venue, it's important to specify the number of guests attending your occasion. Please ensure to include the number of guests. For further discussion, click <Link href="/message" className="text-blue-700 font-semibold">Message me</Link> to collaborate on making your event even more memorable.</p>
                        <Checkbox value="" text="Do you want to use your own tables and chairs" onChange={ ev => setTablesNChairsProvided(ev.target.checked) }/>
                    </div>
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Number of Guest</label>
                        <input 
                            name="noofguest" 
                            onChange={ guestNoInput } 
                            className="input w-full border border-neutral-500/40" 
                            placeholder="Number of Guest"
                        />
                        <ErrorField message={ invalidFieldsValue['noofguest'] }/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="" className="font-paragraph text-sm font-semibold">Street/Building Name</label>
                        <input 
                            name="street" 
                            onChange={ (ev) => setSelectedAddress(state => ({ ...state, street: ev.target.value })) } 
                            className="input w-full border border-neutral-500/40" placeholder="Street/Building Name" />
                        <ErrorField message={ invalidFieldsValue['street/buildingname'] }/>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Region</label>
                            <select 
                                name="region"
                                defaultValue="placeholder" 
                                onChange={ (ev) => select(ev, 'region') } 
                                className="input w-full border border-neutral-500/40">
                                <option value="placeholder" disabled>Select Region</option>
                                {
                                    regions.map((region, index) => (
                                        <option key={ index } value={ region }>{ region }</option>
                                    ))
                                }
                            </select>
                            <ErrorField message={ invalidFieldsValue['region'] }/>
                        </div>
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Province</label>
                            <select 
                                name="province"
                                defaultValue="placeholder" 
                                onChange={ (ev) => select(ev, 'province') } 
                                className="input w-full border border-neutral-500/40" disabled={ listOfProvince.length === 0 }>
                                <option value="placeholder" disabled>Select Province</option>
                                {
                                    listOfProvince.map((province, index) => (
                                        <option key={ index } value={ province }>{ province }</option>
                                    ))
                                }   
                            </select>
                            <ErrorField message={ invalidFieldsValue['province'] }/>
                        </div>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Municipality</label>
                            <select 
                                name="municipality"
                                defaultValue="placeholder" 
                                onChange={ (ev) => select(ev, 'municipality') } 
                                className="input w-full border border-neutral-500/40" disabled={ listOfMunicipality.length === 0 }>
                                <option value="placeholder" disabled>Select Municipality</option>
                                {
                                    listOfMunicipality.map((municipality, index) => (
                                        <option key={ index } value={ municipality }>{ municipality }</option>
                                    ))
                                }   
                            </select>
                            <ErrorField message={ invalidFieldsValue['municipality'] }/>
                        </div>
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Barangay</label>
                            <select 
                                name="barangay"
                                defaultValue="placeholder"  
                                onChange={ (ev) => setSelectedAddress(state => ({ ...state, barangay: ev.target.value })) } 
                                className="input w-full border border-neutral-500/40" disabled={ listOfBarangay.length === 0 }>
                                <option value="placeholder" disabled>Select Barangay</option>
                                {
                                    listOfBarangay.map((barangay, index) => (
                                        <option key={ index } value={ barangay }>{ barangay }</option>
                                    ))
                                }   
                            </select>
                            <ErrorField message={ invalidFieldsValue['barangay'] }/>
                        </div>
                    </div>  
                    <div className="w-full flex gap-4">
                        <button onClick={ () => setConfirmationPrompt(true) } className="w-1/2 button shadow-md border border-neutral-500/40">Save</button>
                        <button onClick={ () => router.push('/reserve?display=themes') } className="w-1/2 button shadow-md border border-neutral-500/40">
                            Cancel
                        </button>
                    </div>
                    
                </div>
            </div>
            <div className="w-1/2 ml-auto pl-2">
                <ErrorField message={ invalidFieldsValue?.unauth }/>
            </div>
            {
                confirmationPrompt && <Prompt callback={ saveProvidedVenueInfo } onClose={ () => setConfirmationPrompt(false) } header="Confirm Venue Info"
                    message={ `Are you sure you want your place to be the venue of the event? ${
                        tablesNChairsProvided 
                            ? 'You will be responsible for providing chairs and tables.' 
                            : 'We will provide chairs and tables, but there will be an additional charge for this service.'
                    }` }
                />
            }
        </section>
    );
}

export default Venues;