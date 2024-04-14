'use client';
import UploadButton from '@/components/UploadButton';
import Loading from '@/components/Loading';
import ErrorField from '@/components/ErrorField';
import { Suspense, useEffect, useState } from 'react';
import { emptyVenueFields } from '@/utils/admin/emptyValidation';
import { sendFormUpdate } from '@/utils/send';
import { handleError } from '@/utils/auth/backendError';
import { useRouter } from 'next/navigation';
import { toNumber } from '@/utils/number';

import { addressAll } from '@/utils/philAddress';
import { regions } from '@/utils/philAddress';
import { zVenue } from '@/stores/admin/venue';

const UpdateVenue = () => {
    const [ venueName, setVenueName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ file, setFile ] = useState(undefined);
    const [ price, setPrice ] = useState(0);
    const [ chargeForTablesAndChairs, setChargeForTablesAndChairs ] = useState(0);
    const [ maximumSeatingCapacity, setMaximumSeatingCapacity ] = useState(0);
    const [ status, setStatus ] = useState('available');

    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const router = useRouter();

    const [ selectedAddress, setSelectedAddress ] = useState({ street: '', region: '', province: '', municipality: '', barangay: '' });
    const [ listOfProvince, setListOfProvince ] = useState([]);
    const [ listOfMunicipality, setListOfMunicipality ] = useState([]);
    const [ listOfBarangay, setListOfBarangay ] = useState([]);

    const [ isImageChange, setImageChange ] = useState(false);

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setInvalidFieldsValue({});
        setLoading(true);

        
        const img = true;
        const { street, region, province, municipality, barangay } = selectedAddress;
        const invalidFields = emptyVenueFields(venueName, description, img, region, province, municipality, barangay, street);
        for(const [field, message] of Object.entries(invalidFields))
        setInvalidFieldsValue(prev => ({ ...prev, [field]: message }));
    
        if(!price) setInvalidFieldsValue(prev => ({ ...prev, price: 'Enter a numerical value greater than zero for the price' }));
        if(!maximumSeatingCapacity) setInvalidFieldsValue(prev => ({ ...prev, maximumSeatingCapacity: 'Enter a numerical value greater than zero for the maximum seating capacity' }));

        if(Object.values(invalidFields).length === 0) {
            try {
                const form = new FormData(ev.target);
                form.append('id', zVenue.getState().id);
                form.append('is-image-change', Number(isImageChange)); // Number convert true - 1, false - 0, but still it will be converted to string '1' and '0'
                
                console.log('update');
                const createVenueResponse = await sendFormUpdate('/api/venues', form);
                if(createVenueResponse?.success) {
                    router.push('/admin?display=venues');
                }
            } catch(error) {
                const backendError = handleError(error);
                setInvalidFieldsValue(prev => ({ ...prev, ...backendError }));
            }
        }

        setLoading(false);
    }

    const priceInput = (ev) => {
        const value = ev.target.value;
        const priceOfVenue = toNumber(value);
        ev.target.value = priceOfVenue;
        setPrice(priceOfVenue);

        if(isNaN(Number(value))) setInvalidFieldsValue(prev => ({ ...prev, price: 'Please enter a numerical value for the price.' }));
    }

    const maximumSeatingCapacityInput = (ev) => {
        const value = ev.target.value;
        const capacity = toNumber(value);
        ev.target.value = capacity;
        setMaximumSeatingCapacity(capacity);

        if(isNaN(Number(value))) setInvalidFieldsValue(prev => ({ ...prev, maximumSeatingCapacity: 'Please enter a numerical value for the maximum seating capacity.' }));
    }

    const tablesNChairsInput = (ev) => {
        const value = ev.target.value;
        const charge = toNumber(value);
        ev.target.value = charge;
        setChargeForTablesAndChairs(charge);

        if(isNaN(Number(value))) setInvalidFieldsValue(prev => ({ ...prev, tablesNChairsCharge: 'Please enter a numerical value for the additional charges for tables and chairs.' }));
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
        setVenueName(zVenue.getState().name);
        setDescription(zVenue.getState().description);
        setPrice(zVenue.getState().price);
        setMaximumSeatingCapacity(zVenue.getState().maximumSeatingCapacity);
        setChargeForTablesAndChairs(zVenue.getState().chargeForTablesAndChairs || 0);
        setStatus(zVenue.getState().status);

        const { region, province, municipality, barangay, street } = zVenue.getState().address;
        const fRegion = region?.toUpperCase() || '';
        const fProvince = province?.toUpperCase() || '';
        const fMunicipality = municipality?.toUpperCase() || '';
        const fBarangay = barangay?.toUpperCase() || '';

        setSelectedAddress({ region: fRegion, province: fProvince, municipality: fMunicipality, barangay: fBarangay, street });

        // manually hard coded this one since addressAll is not mounted yet, I don't want to 
        // create another useEffect with addressAll as dependency since it always mutate
        setListOfProvince(Object.keys(addressAll[fRegion]?.province || {})); // generate province list
        setListOfMunicipality(Object.keys(addressAll[fRegion]?.province[fProvince]?.municipality || {})); // generate municipality list
        setListOfBarangay(addressAll[fRegion]?.province[fProvince]?.municipality[fMunicipality].barangay || {}); // generate barangay list
    }, []);

    useEffect(() => {
        // to make sure image update would not happen
        // if user didn't change it so it's unnecessary
        if(file)
            setImageChange(true);
    }, [ file ]);

    return (
        <section className="flex flex-col gap-2 p-4">
            { loading && <Loading customStyle="size-full" /> }
            <div className="flex justify-between items-center p-1 rounded-lg">
                <h2 className="font-headings font-semibold">Update Venue</h2>
            </div>
            <form onSubmit={ handleSubmit } className="flex gap-4 font-paragraphs">
                <div className="flex flex-col gap-4">
                    <UploadButton fileData={ [ file, setFile ]} initialImageSrc={ zVenue.getState().filename } />
                    <article className="max-w-96 text-yellow-900 text-sm p-2 bg-yellow-500/20 rounded-md shadow-md">Keep in mind that uploading your image file may result in the loss of some important features, such as transparency, as the uploaded image file will be converted to a JPG file for performance enhancement</article>
                </div>
                <div className="grow flex flex-col gap-4 py-6">
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Venue Name</label>
                        <input value={ venueName } name="venuename" onChange={(ev) => setVenueName(ev.target.value)} className="input w-full border border-neutral-500/40" placeholder="Venue Name" />
                        <ErrorField message={ invalidFieldsValue['venuename'] }/>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Price</label>
                            <input value={ price } name="price" onChange={ priceInput } className="input w-full border border-neutral-500/40" placeholder="Price" />
                            <ErrorField message={ invalidFieldsValue['price'] }/>
                        </div>
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Maximum Seating Capacity</label>
                            <input value={ maximumSeatingCapacity } name="maximumSeatingCapacity" onChange={ maximumSeatingCapacityInput } className="input w-full border border-neutral-500/40" placeholder="Maximum Seating Capacity" />
                            <ErrorField message={ invalidFieldsValue['maximumSeatingCapacity'] }/>
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Additional Charges for Tables and Chairs</label>
                        <input value={ chargeForTablesAndChairs } name="chargeForTablesAndChairs" onChange={ tablesNChairsInput } className="input w-full border border-neutral-500/40" placeholder="Additional Charges for Tables and Chairs(Optional)" />
                        <ErrorField message={ invalidFieldsValue['chargeForTablesAndChairs'] }/>
                    </div>
                    <div>
                        <label className="font-paragraph text-sm font-semibold">Description</label>
                        <textarea value={ description } name="description" onChange={(ev) => setDescription(ev.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Description"></textarea>
                        <ErrorField message={ invalidFieldsValue['description'] }/>
                    </div>
                    <h2 className="font-headings">Address</h2>
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Street/Building Name</label>
                        <input 
                            value={ selectedAddress.street }
                            name="street" 
                            onChange={ (ev) => setSelectedAddress(state => ({ ...state, street: ev.target.value })) } 
                            className="input w-full border border-neutral-500/40" placeholder="Street/Building Name" />
                        <ErrorField message={ invalidFieldsValue['street/buildingname'] }/>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Region</label>
                            <select 
                                value={ selectedAddress.region }
                                name="region"
                                onChange={ (ev) => select(ev, 'region') } 
                                className="input w-full border border-neutral-500/40">
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
                                value={ selectedAddress.province }
                                name="province"
                                onChange={ (ev) => select(ev, 'province') } 
                                className="input w-full border border-neutral-500/40" disabled={ listOfProvince.length === 0 }>
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
                                value={ selectedAddress.municipality }
                                name="municipality"
                                onChange={ (ev) => select(ev, 'municipality') } 
                                className="input w-full border border-neutral-500/40" disabled={ listOfMunicipality.length === 0 }>
                                {
                                    listOfMunicipality?.map((municipality, index) => (
                                        <option key={ index } value={ municipality }>{ municipality }</option>
                                    ))
                                }   
                            </select>
                            <ErrorField message={ invalidFieldsValue['municipality'] }/>
                        </div>
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Barangay</label>
                            <select 
                                value={ selectedAddress.barangay }
                                name="barangay"
                                onChange={ (ev) => setSelectedAddress(state => ({ ...state, barangay: ev.target.value })) } 
                                className="input w-full border border-neutral-500/40" disabled={ listOfBarangay.length === 0 }>
                                {
                                    listOfBarangay.map((barangay, index) => (
                                        <option key={ index } value={ barangay }>{ barangay }</option>
                                    ))
                                }   
                            </select>
                            <ErrorField message={ invalidFieldsValue['barangay'] }/>
                        </div>
                    </div>  
                    <div className="flex flex-col">
                        <h4 className="font-headings text-sm font-semibold">Status:</h4>
                        <div className="flex gap-2 items-center">
                            <input type="hidden" name="status" value={ status } />
                            <button onClick={ (ev) => {
                                ev.preventDefault();
                                setStatus(status === 'available' ? 'unavailable' : 'available');
                            } } className={ `w-12 h-6 flex items-center bg-neutral-400 rounded-full ${ status === 'available' ? 'justify-end' : 'justify-start'}` }>
                                <div onClick={ ev => ev.preventDefault() } className={ `size-[26px] rounded-full border border-neutral-300 ${ status === 'available' ? 'bg-green-500' : 'bg-red-500' }` }></div>
                            </button>
                            <span className={ `text-sm rounded-full px-1 ${ status === 'available' ? 'bg-green-200/40 text-green-500' : 'bg-red-200/40 text-red-500' }` }>{ status }</span>
                        </div>
                    </div>
                    <div className="w-full flex gap-4">
                        <button type="submit" className="w-1/2 button shadow-md border border-neutral-500/40">Update</button>
                        <button onClick={ (ev) => {
                            ev.preventDefault();
                            router.push('/admin?display=venues')
                        }} className="w-1/2 button shadow-md border border-neutral-500/40">
                            Cancel
                        </button>
                    </div>
                    <ErrorField message={ invalidFieldsValue?.unauth }/>
                    <ErrorField message={ invalidFieldsValue['image'] }/>
                </div>
            </form>
        </section>
    );
}

export default UpdateVenue;