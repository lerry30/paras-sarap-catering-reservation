'use client';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import Loading from '@/components/Loading';

import { addressAll } from '@/utils/philAddress';
import { regions } from '@/utils/philAddress';
import ErrorField from '@/components/ErrorField';

const Venues = () => {
    const [ venues, setVenues ] = useState([]); // database
    const [ allSelects, setAllSelects ] = useState([]);
    const [ description, setDescription ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});

    const [ selectedAddress, setSelectedAddress ] = useState({ street: '', region: '', province: '', municipality: '', barangay: '' });
    const [ listOfProvince, setListOfProvince ] = useState([]);
    const [ listOfMunicipality, setListOfMunicipality ] = useState([]);
    const [ listOfBarangay, setListOfBarangay ] = useState([]);

    const getVenues = async () => {
        const { data } = (await getData('/api/venues')) || { data: [] };
        setVenues(data);

        setAllSelects(Array(data.length).fill(false));
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
        getVenues();
    }, []);

    return (
        <section className="w-full flex flex-col gap-2 py-4 px-page-x">
            { loading && <Loading customStyle="size-full" /> }
            <div className="flex justify-between items-center p-1 rounded-lg">
                <h2 className="font-headings font-semibold">Add Your Venue</h2>
            </div>
            <div className="font-paragraphs grow flex py-2 gap-4">
                <div className="w-1/2 flex flex-col gap-4" >
                    <div className="w-full">
                        <input name="venuename" onChange={(ev) => setVenueName(ev.target.value)} className="input w-full border border-neutral-500/40" placeholder="Venue Name" />
                        <ErrorField message={ invalidFieldsValue['venuename'] }/>
                    </div>
                    <div>
                        <textarea name="description" onChange={(ev) => setDescription(ev.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Description"></textarea>
                        <ErrorField message={ invalidFieldsValue['description'] }/>
                    </div>
                    <div className="w-full">
                        <input 
                            name="street" 
                            onChange={ (ev) => setSelectedAddress(state => ({ ...state, street: ev.target.value })) } 
                            className="input w-full border border-neutral-500/40" placeholder="Street/Building Name" />
                        <ErrorField message={ invalidFieldsValue['street/buildingname'] }/>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="w-1/2">
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
                        <button className="w-1/2 button shadow-md border border-neutral-500/40">Save</button>
                        <button onClick={ () => router.push('/admin?display=venues') } className="w-1/2 button shadow-md border border-neutral-500/40">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <ErrorField message={ invalidFieldsValue?.unauth }/>
            <ErrorField message={ invalidFieldsValue['image'] }/>
        </section>
    );
}

export default Venues;