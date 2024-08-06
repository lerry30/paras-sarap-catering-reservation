'use client';
import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { getData, sendFormUpdate } from '@/utils/send';
import { toNumber } from '@/utils/number';
import { Prompt } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

const Settings = () => {
    const [ durationOfServiceInHours, setDurationOfServiceInHours ] = useState(0);
    const [ additionalServiceTimeCostPerHour, setAdditionalServiceTimeCostPerHour ] = useState(0); 
    const [ noOfPreparationDays, setNoOfPreparationDays ] = useState(0);

    const [ change, setChange ] = useState(false);
    const [ actionRequired, setActionRequired ] = useState(false);

    const [ loading, setLoading ] = useState(false);

    const oldDuration = useRef(0);
    const oldExtraTime = useRef(0);
    const oldPrep = useRef(0);

    const page = useRef(null);
    const redirectTo = useRef('');
    const router = useRouter();

    const getConfigurationValues = async () => {
        try {
            const response = await getData('/api/policies/reservation');
            const configs = response?.data;
            
            setDurationOfServiceInHours(configs?.durationOfServiceInHours); 
            setAdditionalServiceTimeCostPerHour(configs?.additionalServiceTimeCostPerHour); 
            setNoOfPreparationDays(configs?.noOfPreparationDays);

            oldDuration.current = configs?.durationOfServiceInHours; 
            oldExtraTime.current = configs?.additionalServiceTimeCostPerHour; 
            oldPrep.current = configs?.noOfPreparationDays;
        } catch(error) {}
    }

    useLayoutEffect(() => getConfigurationValues, []);

    const changeDurationOfService = (duration) => {
        const nDuration = toNumber(duration);
        if(nDuration < 0) return;
        setDurationOfServiceInHours(nDuration);
        setChange(true);
    }

    const changeExtraTimeCost = (cost) => {
        const nCost = cost.replace(/[^0-9.]/g, '');
        setAdditionalServiceTimeCostPerHour(nCost);
        setChange(true);
    }

    const changeNoOfPreparationDays = (days) => {
        const nDays = toNumber(days);
        if(nDays < 0) return;
        setNoOfPreparationDays(nDays);
        setChange(true);
    }

    const reset = () => {
        setDurationOfServiceInHours(oldDuration.current);
        setAdditionalServiceTimeCostPerHour(oldExtraTime.current);
        setNoOfPreparationDays(oldPrep.current);
        setChange(false);
    }

    const handleChanges = async (form) => {
        try {
            setLoading(true);
            const formData = new FormData(form);
            const response = await sendFormUpdate('/api/policies/reservation', formData);
            if(response?.success) {
                setChange(false);
                oldDuration.current = durationOfServiceInHours;
                oldExtraTime.current = additionalServiceTimeCostPerHour;
                oldPrep.current = noOfPreparationDays;
            }
        } catch(error) {}
        setLoading(false);
    }

    // clicked outside
    const close = (ev) => {
        setChange(value => {
            if(value) {
                ev.preventDefault();
                const clickedLink = ev.currentTarget;
                if(!page.current.contains(clickedLink)) {
                    setActionRequired(true);
                    redirectTo.current = clickedLink.getAttribute('href');
                }
            }
            
            return value;
        });
    }

    useEffect(() => {
        const allLinks = document.querySelectorAll('a');
        for(let i = 0; i < allLinks.length; i++) {
            const link = allLinks[i];
            link.addEventListener('click', close);
        }
    
        return () => {
            for(let i = 0; i < allLinks.length; i++) {
                const link = allLinks[i];
                link.removeEventListener('click', close);
            }
        };
    }, []);

    return (
        <section ref={page} className="h-[calc(100vh-var(--nav-height))] bg-neutral-100 p-4">
            { loading && <Loading customStyle="size-full" /> }
            <div className="flex justify-between items-center py-1 rounded-lg">
                <h2 className="font-headings font-semibold">Reservation Settings</h2>
            </div>
            <form onSubmit={ ev => {
                    ev.preventDefault();
                    handleChanges(ev.target); 
                }} className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="service-duration" className="font-paragraphs text-lg">Service Duration (in Hours):</label>
                    <input name="service-duration" id="service-duration" value={ durationOfServiceInHours } onChange={ ev => changeDurationOfService(ev.target.value) } className="p-2 rounded-md border-[1px] border-neutral-500" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="additional-time-cost" className="font-paragraphs text-lg">Extra Service Time <strong className="bg-blue-200 rounded-full px-1">Cost</strong> (Per Hour):</label>
                    <input name="additional-time-cost" id="additional-time-cost" value={ additionalServiceTimeCostPerHour } onChange={ ev => changeExtraTimeCost(ev.target.value) } className="p-2 rounded-md border-[1px] border-neutral-500" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="reservation-preparation" className="font-paragraphs text-lg">Preparation Time (in Days):</label>
                    <input name="reservation-preparation" id="reservation-preparation" value={ noOfPreparationDays } onChange={ ev => changeNoOfPreparationDays(ev.target.value) } className="p-2 rounded-md border-[1px] border-neutral-500" />
                </div> 
                <div className="flex gap-2">
                    <button type="submit" disabled={!change} className="button text-white" style={{ opacity: change ? '1' : '0.8' }}>Done</button>
                    { change && <button type="button" onClick={reset} className="button !bg-white">reset</button> }
                </div>
            </form>
            {
                actionRequired && <Prompt 
                    callback={ async () => {
                        setActionRequired(false);
                        setChange(false); // I need to set change to false since actionRequired is not updated so I nothing to do with it
                        const form = page.current.querySelector('form');
                        await handleChanges(form);
                        router.push(redirectTo.current);
                    }} 
					onClose={ () => { 
						reset();
                        setActionRequired(false);
                        router.push(redirectTo.current);
				}} header="Save Changes?" message="Select 'Yes' to save your changes or 'Cancel' to revert to the previous values."/>
            }
        </section>
    );
}

export default Settings;
