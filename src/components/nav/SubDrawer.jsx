import { useState, useRef } from 'react';
import { ChevronDown } from '@/components/icons/All';

const ParentOption = ({ children, text='', className='' }) => {
    const [ open, setOpen ] = useState(true);
    const dropdownArrow = useRef(null);

    const listDown = () => {
        setOpen(state => !state);
        dropdownArrow.current.dataset.ui = dropdownArrow.current.dataset.ui ? '' : 'active';
    }

    return (
        <div className={ ` ${ className }` }>
            <button onClick={ listDown } className="w-full flex justify-between mb-1">
                <h4>{ text }</h4>
                <span ref={ dropdownArrow } className="data-active:-rotate-90 transition-transform">
                    <ChevronDown />
                </span>
            </button>
            <div className={ `overflow-hidden ${ open ? 'h-fill' : 'h-0' }` }>
                <div className={ `pl-6 flex flex-col transition-transform ${ open ? 'translate-y-0' : '-translate-y-full' }` }>
                    { children }
                </div>
            </div>
        </div>
    );
}

export default ParentOption;