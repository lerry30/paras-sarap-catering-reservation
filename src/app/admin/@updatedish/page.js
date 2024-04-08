'use client';
import UploadButton from '@/components/UploadButton';
import Loading from '@/components/Loading';
import ErrorField from '@/components/ErrorField';
import Checkbox from '@/components/Checkbox';
import { useState, useEffect, useRef, useMemo, createRef } from 'react';
import { emptyDishFields } from '@/utils/dishes/emptyValidation';
import { sendForm } from '@/utils/send';
import { handleError } from '@/utils/auth/backendError';
import { useRouter } from 'next/navigation';
import { toNumber } from '@/utils/number';
import { zDish } from '@/stores/dish';

const UpdateDish = () => {
    const [ dishName, setDishName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ file, setFile ] = useState(undefined);
    const [ allergensCheckbox, setAllergensCheckbox ] = useState([]);
    const [ costPerHead, setCostPerHead ] = useState(0);
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const router = useRouter();

    const prevDishId = zDish(state => state.id);
    const prevDishName = zDish(state => state.name);
    const prevDishDescription = zDish(state => state.description);
    const prevDishAllergens = zDish(state => state.allergens);
    const prevDishFilename = zDish(state => state.filename);
    const prevDishCostPerHead = zDish(state => state.costperhead);

    const checkboxAllergens = [ 'nuts', 'seafood', 'milk', 'eggs', 'soybeans', 'grains' ];
    const checkBoxes = useRef({});

    const initCheckBox = () => {
        const checkedBoxes = prevDishAllergens.map(box => checkBoxes.current[box]);
        for(const checkbox of checkedBoxes)
            checkbox.checked = true;
    }

    const checkboxHandler = (ev) => {  
        const checkBox = ev.target;
        const allergen = (checkBox.value || '').trim();
        if(checkBox.checked) {
            if(checkboxAllergens.includes(allergen))
                setAllergensCheckbox(item => ( [...new Set([ ...item, allergen ])] ));
            return;
        }

        setAllergensCheckbox(sAllergens => ( sAllergens.filter(item => item !== allergen )));
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setInvalidFieldsValue({});
        setLoading(true);

        const invalidFields = emptyDishFields(dishName, description, file);
        for(const [field, message] of Object.entries(invalidFields))
            setInvalidFieldsValue(prev => ({ ...prev, [field]: message }));

        if(!costPerHead) setInvalidFieldsValue(prev => ({ ...prev, costperhead: 'Enter a numerical value greater than zero for the cost per head' }));

        if(Object.values(invalidFields).length === 0) {
            try {
                const form = new FormData(ev.target);
                form.append('allergens', allergensCheckbox); // form will convert this array in to string
                const createDishResponse = await sendForm('/api/dishes', form);
                if(createDishResponse?.success) {
                    router.push('/admin?display=dishes');
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
            ev.target.value = cost;
            setCostPerHead(cost);

            if(isNaN(Number(value))) setInvalidFieldsValue(prev => ({ ...prev, costperhead: 'Please enter a numerical value for the cost per head.' }));

    }

    useEffect(() => {
        initCheckBox();
        // if store doesn't have value
        if(!prevDishId)
            router.push('/admin?display=dishes');
    }, []);

    return (
        <section className="flex flex-col gap-2 p-4">
            { loading && <Loading customStyle="size-full" /> }
            <div className="flex justify-between items-center p-1 rounded-lg">
                <h2 className="font-headings font-semibold">Add New Dish</h2>
            </div>
            <form onSubmit={ handleSubmit } className="flex gap-4 font-paragraphs">
                <div className="flex flex-col gap-4">
                    <UploadButton fileData={ [ file, setFile ]} initialImageSrc={ prevDishFilename } />
                    <article className="max-w-96 text-yellow-900 text-sm p-2 bg-yellow-500/20 rounded-md shadow-md">Keep in mind that uploading your image file may result in the loss of some important features, such as transparency, as the uploaded image file will be converted to a JPG file for performance enhancement</article>
                </div>
                <div className="grow flex flex-col gap-4 py-6">
                    <div className="w-full flex gap-4">
                        <div className="w-1/2">
                            <input value={ prevDishName } name="dishname" onChange={(e) => setDishName(e.target.value)} className="input w-full border border-neutral-500/40" placeholder="Dish Name" />
                            <ErrorField message={ invalidFieldsValue['dishname'] }/>
                        </div>
                        <div className="w-1/2">
                            <input value={ prevDishCostPerHead } name="costperhead" onChange={ costPerHeadInput } className="input w-full border border-neutral-500/40" placeholder="Cost Per Head" />
                            <ErrorField message={ invalidFieldsValue['costperhead'] }/>
                        </div>
                    </div>
                    <div>
                        <textarea value={ prevDishDescription } name="description" onChange={(e) => setDescription(e.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Description"></textarea>
                        <ErrorField message={ invalidFieldsValue['description'] }/>
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm">Is it contains ingredients that can cause an allergic reaction (peanuts and other nuts, seafood, fish, milk, eggs, soybeans, wheat and other gluten containing grains)? It must be declared, however small the amount.</p>
                        <Checkbox ref={ checkbox => checkBoxes.current['nuts'] = checkbox } value="nuts" onChange={ checkboxHandler } text="Peanuts or tree nuts (such as almonds, cashews, walnuts)" />
                        <Checkbox ref={ checkbox => checkBoxes.current['seafood'] = checkbox } value="seafood" onChange={ checkboxHandler } text="Seafood (including fish and shellfish)" />
                        <Checkbox ref={ checkbox => checkBoxes.current['milk'] = checkbox } value="milk" onChange={ checkboxHandler } text="Milk" />
                        <Checkbox ref={ checkbox => checkBoxes.current['eggs'] = checkbox } value="eggs" onChange={ checkboxHandler } text="Eggs" />
                        <Checkbox ref={ checkbox => checkBoxes.current['soybeans'] = checkbox } value="soybeans" onChange={ checkboxHandler } text="Soybeans" />
                        <Checkbox ref={ checkbox => checkBoxes.current['grains'] = checkbox } value="grains" onChange={ checkboxHandler } text="Wheat and other gluten-containing grains" />
                    </div>
                    <button type="submit" className="button shadow-md border border-neutral-500/40">Save</button>
                    <ErrorField message={ invalidFieldsValue?.unauth }/>
                    <ErrorField message={ invalidFieldsValue['image'] }/>
                </div>
            </form>
        </section>
    );
}

export default UpdateDish;

// Is it contains ingredients that can cause an allergic reaction (peanuts and other nuts, 
// seafood, fish, milk, eggs, soybeans, wheat and other gluten containing 
// grains)? It must be declared, however small the amount.