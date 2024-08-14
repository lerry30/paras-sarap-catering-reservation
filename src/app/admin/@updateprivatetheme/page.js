'use client';
import UploadButton from '@/components/UploadButton';
import Loading from '@/components/Loading';
import ErrorField from '@/components/ErrorField';
import { zPrivateTheme } from '@/stores/admin/privatetheme';
import { useState, useLayoutEffect, useEffect } from 'react';
import { emptyThemeFields } from '@/utils/client/emptyValidation';
import { sendFormUpdate } from '@/utils/send';
import { handleError } from '@/utils/auth/backendError';
import { useRouter } from 'next/navigation';

const UpdatePrivateTheme = () => {
    const [ themeName, setThemeName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ file, setFile ] = useState(undefined);
    const [ invalidFieldsValue, setInvalidFieldsValue ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ isImageChange, setImageChange ] = useState(false);
    const router = useRouter();

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        setInvalidFieldsValue({});
        setLoading(true);

        const invalidFields = emptyThemeFields(themeName, description, true);
        setInvalidFieldsValue(invalidFields);

        if(Object.values(invalidFields).length === 0) {
            try {
                const form = new FormData(ev.target);
                form.append('id', zPrivateTheme.getState().id);
                form.append('is-image-change', Number(isImageChange)); // Number convert true - 1, false - 0, but still it will be converted to string '1' and '0'
                const createThemeResponse = await sendFormUpdate('/api/themes/private', form);
                if(createThemeResponse?.success) {
                    router.push('/admin?display=privatethemes');
                }
            } catch(error) {
                const backendError = handleError(error);
                setInvalidFieldsValue(prev => ({ ...prev, ...backendError }));
            }
        }

        setLoading(false);
    }

    useLayoutEffect(() => {
        setThemeName(zPrivateTheme.getState().name);
        setDescription(zPrivateTheme.getState().description);
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
                <h2 className="font-headings font-semibold">Update Private Theme</h2>
            </div>
            <form onSubmit={ handleSubmit } className="flex gap-4 font-paragraphs">
                <div className="flex flex-col gap-4">
                    <UploadButton fileData={ [ file, setFile ]} className="size-95" initialImageSrc={ zPrivateTheme.getState().filename } />
                    <article className="max-w-96 text-yellow-900 text-sm p-2 bg-yellow-500/20 rounded-md shadow-md">Keep in mind that uploading your image file may result in the loss of some important features, such as transparency, as the uploaded image file will be converted to a JPG file for performance enhancement</article>
                </div>
                <div className="grow flex flex-col gap-4 py-6">
                    <div className="w-full">
                        <label className="font-paragraph text-sm font-semibold">Private Theme Name</label>
                        <input name="themename" value={themeName} onChange={(e) => setThemeName(e.target.value)} className="input w-full border border-neutral-500/40" placeholder="Update Private Theme Name" />
                        <ErrorField message={ invalidFieldsValue['themename'] }/>
                    </div>
                    <div>
                        <label className="font-paragraph text-sm font-semibold">Description</label>
                        <textarea name="description" value={description} onChange={ev => setDescription(ev.target.value)} className="input w-full h-40 border border-neutral-500/40" placeholder="Description"></textarea>
                        <ErrorField message={ invalidFieldsValue['description'] }/>
                    </div>
                    <div className="w-full flex gap-4">
                        <button type="submit" className="w-1/2 button shadow-md border border-neutral-500/40">Update</button>
                        <button onClick={ (ev) => {
                            ev.preventDefault();
                            router.push('/admin?display=privatethemes')
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

export default UpdatePrivateTheme;
