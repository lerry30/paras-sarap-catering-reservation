import { forwardRef } from 'react';

const Checkbox = forwardRef(({ value='', text='', onChange=()=>{} }, ref) => {
    return (
        <div className="flex gap-2">
            <input ref={ ref } value={ value } type="checkbox" className="size-4 mt-1" onChange={ onChange } />
            <span className="text-sm">{ text }</span>
        </div>
    );
});

export default Checkbox;