'use client';
import UploadButton from '@/components/UploadButton';
import Loading from '@/components/Loading';
import ErrorField from '@/components/ErrorField';
import { useState, useEffect } from 'react';
import { emptyDrinkFields } from '@/utils/admin/emptyValidation';
import { sendFormUpdate } from '@/utils/send';
import { handleError } from '@/utils/auth/backendError';
import { useRouter } from 'next/navigation';
import { toNumber } from '@/utils/number';
import { zDrink } from '@/stores/drink';

const UpdateDrink = () => {
    const [ drinkName, setDrinkName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ file, setFile ] = useState(undefined);
    const [ costPerHead, setCostPerHead ] = useState(0);
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ isImageChange, setImageChange ] = useState(false);
    const [ status, setStatus ] = useState('available');
    const router = useRouter();

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setInvalidFieldsValue({});
        setLoading(true);

        const img = true; // I passed an object of Image since the image can't be empty
        const invalidFields = emptyDrinkFields(drinkName, description, img);
        for(const [field, message] of Object.entries(invalidFields))
            setInvalidFieldsValue(prev => ({ ...prev, [field]: message }));

        if(!costPerHead) setInvalidFieldsValue(prev => ({ ...prev, costperhead: 'Enter a numerical value greater than zero for the cost per head' }));

        if(Object.values(invalidFields).length === 0) {
            try {
                const form = new FormData(ev.target);
                form.append('id', zDrink.getState().id);
                form.append('is-image-change', Number(isImageChange)); // Number convert true - 1, false - 0, but still it will be converted to string '1' and '0'
                const createDrinkResponse = await sendFormUpdate('/api/drinks', form);
                if(createDrinkResponse?.success) {
                    router.push('/admin?display=drinks');
                }
            } catch(error) {
                const backendError = handleError(error);
                setInvalidFieldsValue(prev => ({ ...prev, ...backendError }));
            }
        }

        setLoading(false);
    }

    const costPerHeadInput = (ev) => {
        const value = ev.target.value;
        const cost = toNumber(value);
        setCostPerHead(cost);

        if(isNaN(Number(value))) setInvalidFieldsValue(prev => ({ ...prev, costperhead: 'Please enter a numerical value for the cost per head.' }));
    }

    useEffect(() => {
        setDrinkName(zDrink.getState().name);
        setDescription(zDrink.getState().description);
        setCostPerHead(zDrink.getState().costperhead);
        setStatus(zDrink.getState().status);

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
                <h2 className="font-headings font-semibold">Update Drink</h2>
            </div>
            <form onSubmit={ handleSubmit } className="flex gap-4 font-paragraphs">
                <div className="flex flex-col gap-4">
                    <UploadButton fileData={ [ file, setFile ]} initialImageSrc={ zDrink.getState().filename } />
                    <article className="max-w-96 text-yellow-900 text-sm p-2 bg-yellow-500/20 rounded-md shadow-md">Keep in mind that uploading your image file may result in the loss of some important features, such as transparency, as the uploaded image file will be converted to a JPG file for performance enhancement</article>
                </div>
                <div className="grow flex flex-col gap-4 py-6">
                    <div className="w-full">
                        <input value={ drinkName } name="drinkname" onChange={(e) => setDrinkName(e.target.value)} className="input w-full border border-neutral-500/40" placeholder="Drink Name" />
                        <ErrorField message={ invalidFieldsValue['drinkname'] }/>
                    </div>
                    <div className="w-full">
                        <input value={ costPerHead } name="costperhead" onChange={ costPerHeadInput } className="input w-full border border-neutral-500/40" placeholder="Cost Per Head" />
                        <ErrorField message={ invalidFieldsValue['costperhead'] }/>
                    </div>
                    <div>
                        <textarea value={ description } name="description" onChange={(e) => setDescription(e.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Description"></textarea>
                        <ErrorField message={ invalidFieldsValue['description'] }/>
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
                        <button type="submit" className="w-1/2 button shadow-md border border-neutral-500/40 bg-emerald-500/40">Update</button>
                        <button onClick={ (ev) => {
                            ev.preventDefault();
                            router.push('/admin?display=drinks')
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

export default UpdateDrink;