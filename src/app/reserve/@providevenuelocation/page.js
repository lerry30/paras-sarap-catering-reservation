'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { ChevronRight, ChevronLeft } from '@/components/icons/All';
import { addressAll, regions } from '@/utils/philAddress';
import { zReservation } from '@/stores/reservation';
import { emptyVenueFields } from '@/utils/client/emptyValidation';
import { Prompt } from '@/components/Modal';
import ErrorField from '@/components/ErrorField';
import Checkbox from '@/components/Checkbox';
import Loading from '@/components/Loading';
import Link from 'next/link';
import TitleFormat from '@/utils/titleFormat';
import Breadcrumbs from '@/components/client/nav/Breadcrumbs';

const ProvideVenueLocation = () => {
    const [ venueName, setVenueName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ tablesNChairsProvided, setTablesNChairsProvided ] = useState(false);
    const [ service, setService ] = useState(undefined);
    const [ series, setSeries ] = useState(1); // breadcrumbs
    const [ loading, setLoading ] = useState(false);
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ confirmationPrompt, setConfirmationPrompt ] = useState(false);

    const [ selectedAddress, setSelectedAddress ] = useState({ street: '', region: '', province: '', municipality: '', barangay: '' });
    const [ listOfProvince, setListOfProvince ] = useState([]);
    const [ listOfMunicipality, setListOfMunicipality ] = useState([]);
    const [ listOfBarangay, setListOfBarangay ] = useState([]);

    const services = { wedding: true, debut: true, kidsparty: true, privateparty: true };
    const checkboxForTableNChairs = useRef(null);
    
    const searchParams = useSearchParams();
    const router = useRouter();

    const checkProvidedVenueInfo = () => {
        setInvalidFieldsValue({});

        const { street, region, province, municipality, barangay } = selectedAddress;
        const invalidFields = emptyVenueFields(region, province, municipality, barangay, street);
        setInvalidFieldsValue(prev => ({ ...prev, ...invalidFields }));

        if(Object.values(invalidFields).length === 0) {
            setConfirmationPrompt(true);
        }
    }

    const saveProvidedVenueInfo = async () => {
        setLoading(true);
        try {
            const { street, region, province, municipality, barangay } = selectedAddress;
            const venueData = {
                name: venueName,
                description,
                tablesnchairsprovided: tablesNChairsProvided,
                address: {
                    region: TitleFormat(region), 
                    province: TitleFormat(province), 
                    municipality: TitleFormat(municipality), 
                    barangay: TitleFormat(barangay), 
                    street: TitleFormat(street)
                }
            };

            localStorage.setItem('reservation-cache', JSON.stringify({ venue: { custom: true } }));

            zReservation.getState().saveVenueData(venueData);
            router.push(`/reserve?display=menus&service=${service}&set=2&series=${series}`);
        } catch(error) {
            setInvalidFieldsValue(prev => ({ ...prev, unauth: 'There\'s something wrong!' }));
        }

        setLoading(false);
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
                setListOfMunicipality(Object.keys(addressAll[selectedAddress.region]?.province[selected]?.municipality || {}));
                // reset
                setListOfBarangay([]);
            },
            municipality: () => setListOfBarangay(addressAll[selectedAddress.region]?.province[selectedAddress.province]?.municipality[selected].barangay || {})
        })[key]();
    }

    const setPreservedCacheData = () => {
        // get 
        const venueIsProvided = JSON.parse(localStorage.getItem('reservation-cache') || '{}')?.venue?.custom;
        if(!!venueIsProvided) {
            const savedReservationVenueData = zReservation.getState()?.venue;
            const { street, region, province, municipality, barangay } = savedReservationVenueData?.address;
            const uRegion = region?.toUpperCase()?.trim() || '';
            const uProvince = province?.toUpperCase()?.trim() || '';
            const uMunicipality = municipality?.toUpperCase()?.trim() || '';
            const uBarangay = barangay?.toUpperCase()?.trim() || '';

            // set cache data
            setVenueName(savedReservationVenueData?.name || '');
            setDescription(savedReservationVenueData?.description || '');
            setTablesNChairsProvided(savedReservationVenueData?.tablenchairsprovided);
            setSelectedAddress({ 
                street: street || '', 
                region: uRegion, 
                province: uProvince, 
                municipality: uMunicipality, 
                barangay: uBarangay 
            });

            // to automatically set cache data into dropdown fields
            setListOfProvince(Object.keys(addressAll[uRegion]?.province || {}));
            setListOfMunicipality(Object.keys(addressAll[uRegion]?.province[uProvince]?.municipality || {}));
            setListOfBarangay(addressAll[uRegion]?.province[uProvince]?.municipality[uMunicipality].barangay || {})

            checkboxForTableNChairs.current.checked = savedReservationVenueData?.tablesnchairsprovided;
        }
    }

    useEffect(() => {
        zReservation.getState().init();
        setPreservedCacheData();

        const serviceParam = searchParams.get('service');
        if(!services.hasOwnProperty(serviceParam)) router.push('/');
        setService(serviceParam);

        setSeries(searchParams.get('series'));
    }, []);

    return (
        <section className="w-full flex flex-col pt-4 px-page-x">
            { loading && <Loading customStyle="size-full" /> }
            <Breadcrumbs step={ 2 }>
                <div className="w-full flex justify-end">
                    {/*  <h2 className="font-headings font-semibold">Venues</h2> */}
                    <div className="flex gap-2">
                        <Link href={ `/reserve?display=venues&service=${service}&set=1&series=${series}` } className="flex gap-2 bg-green-600/40 rounded-full px-2 py-1 hover:bg-green-400 transition-colors">
                            <ChevronLeft size={20} />
                            <span className="text-sm font-medium hidden sm:inline">back</span>
                        </Link>
                        <button onClick={ checkProvidedVenueInfo } className="flex gap-2 bg-green-600/40 rounded-full pr-2 py-1 pl-4 hover:bg-green-400 transition-colors">
                            <span className="text-sm font-medium hidden sm:inline">Next</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </Breadcrumbs>
            <div className="flex justify-between items-center p-1 rounded-lg">
                <h2 className="font-headings font-semibold">Add Your Venue</h2>
            </div>
            <div className="font-paragraphs grow flex py-2 gap-4">
                <div className="w-1/2 flex flex-col gap-4" >
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Venue Name (Optional)</label>
                        <input name="venuename" id="venuename" value={ venueName } onChange={(ev) => setVenueName(ev.target.value)} className="input w-full border border-neutral-500/40" placeholder="Venue Name (Optional)" />
                        <ErrorField message={ invalidFieldsValue['venuename'] }/>
                    </div>
                    <div>
                        <label className="font-paragraph text-sm font-semibold">Venue Description (including landmarks)</label>
                        <textarea name="description" value={ description } onChange={(ev) => setDescription(ev.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Please provide a detailed description of the venue. Specify any landmarks nearby for easier identification."></textarea>
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
                    <div className="w-full">
                        <label htmlFor="" className="font-paragraph text-sm font-semibold">Street/Building Name</label>
                        <input 
                            name="street" 
                            onChange={ (ev) => setSelectedAddress(state => ({ ...state, street: ev.target.value })) } 
                            className="input w-full border border-neutral-500/40" placeholder="Street/Building Name"
                            value={ selectedAddress?.street }
                        />
                        <ErrorField message={ invalidFieldsValue['street/buildingname'] }/>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="w-1/2">
                            <label className="font-paragraph text-sm font-semibold">Region</label>
                            <select 
                                name="region"
                                value={ selectedAddress?.region || 'placeholder' }
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
                                value={ selectedAddress?.province || 'placeholder' } 
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
                                value={ selectedAddress?.municipality || 'placeholder' }
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
                                value={ selectedAddress?.barangay || 'placeholder' }
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
                    <div className="flex flex-col gap-4">
                        <p className="text-sm font-paragraphs">By checking the box below, you confirm that you will provide the chairs and tables needed for the event. In addition to providing the venue, it's important to specify the number of guests attending your occasion. Please ensure to include the number of guests. For further discussion, click <Link href="" className="text-blue-700 font-semibold">Message me</Link> to collaborate on making your event even more memorable.</p>
                        <Checkbox ref={ checkboxForTableNChairs } text="Do you want to use your own tables and chairs" onChange={ ev => setTablesNChairsProvided(ev.target.checked) }/>
                    </div>
                </div>
            </div>
            <div className="w-1/2 ml-auto pl-2">
                <ErrorField message={ invalidFieldsValue?.unauth }/>
            </div>
            {
                confirmationPrompt && <Prompt callback={ saveProvidedVenueInfo } onClose={ () => setConfirmationPrompt(false) } header="Confirm Venue Info"
                    message={ `Are you sure you want your place to be the venue for the event? ${
                        tablesNChairsProvided 
                            ? 'You will be responsible for providing chairs and tables.' 
                            : 'We will provide chairs and tables, but there will be an additional charge for this service.'
                    }` }
                />
            }
        </section>
    );
}

export default ProvideVenueLocation;
