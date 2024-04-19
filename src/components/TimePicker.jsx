import { Clock } from '@/components/icons/All';
import { toNumber } from '@/utils/number';
import { useState, useRef, useEffect } from 'react';

const TimePicker = ({ className='', useHour=[], useMinute=[], useMeridiem=[] }) => {
    const [ open, setOpen ] = useState(false);
    const dropdown = useRef(null);
    const dropdownArrow = useRef(null);

    const [ hour, setHour ] = useHour;
    const [ minute, setMinute ] = useMinute;
    const [ meridiem, setMeridiem ] = useMeridiem;

    const hourNumsCont = useRef(null);
    const minuteNumsCont = useRef(null);

    const inputValidate = (ev, start=1, end=12) => {
        const no = toNumber(ev.target.value);
        if(no < start || no > end) {
            ev.target.value = '00';
            return '00';
        }

        const formatted = no.toString().padStart(2, '0');
        ev.target.value = formatted;
        return formatted;
    }

    const meridiemValidate = (ev) => {
        const currentValue = ev.target.value;
        ev.target.value = '';
        setMeridiem('');

        if(currentValue.endsWith('a') || currentValue.endsWith('am')) {
            const nValue = 'am';
            setMeridiem(nValue);
            ev.target.value = nValue;
            return;
        }
        
        if(currentValue.endsWith('p') || currentValue.endsWith('pm')) {
            const nValue = 'pm';
            setMeridiem(nValue);
            ev.target.value = nValue;
            return;
        }
    }

    const setSelectedHour = (ev, fHour) => {
        setHour(fHour);
        const hourItem = ev.target;
        const children = hourItem?.parentElement?.children || [];

        for(const hItem of children) {
            hItem.style.backgroundColor = 'transparent';
            hItem.style.color = 'black';
        }

        hourItem.style.backgroundColor = '#0c8f63';
        hourItem.style.color = 'white';
    }

    const setSelectedMinute = (ev, fMinute) => {
        setMinute(fMinute);
        const minuteItem = ev.target;
        const children = minuteItem?.parentElement?.children || [];

        for(const hItem of children) {
            hItem.style.backgroundColor = 'transparent';
            hItem.style.color = 'black';
        }

        minuteItem.style.backgroundColor = '#0c8f63';
        minuteItem.style.color = 'white';
    }

    const meridiemSelection = (ev, meridiem) => {
        setMeridiem(meridiem);
        const alterTypes = { am: 'pm', pm: 'am' };
        const selectedMeridiem = ev.target;
        const alterMeridiem = selectedMeridiem?.parentElement?.querySelector(`.${ alterTypes[meridiem] }`);
        alterMeridiem.style.backgroundColor = 'transparent';
        selectedMeridiem.style.backgroundColor = '#0c8f63';
        alterMeridiem.style.color = 'black';
        selectedMeridiem.style.color = 'white';
    }

    const toggle = () => {
        setOpen(state => !state);
        dropdown.current.dataset.ui = dropdown.current.dataset.ui ? '' : 'active';
        dropdownArrow.current.dataset.ui = dropdownArrow.current.dataset.ui ? '' : 'active';
    }
    
    const focusOutside = (ev) => {
        if(!dropdown.current?.contains(ev.target)) {
            // just to specify specific element since every click 
            // triggers all instance of this dropdown event listener
            if(dropdown?.current?.dataset?.ui === 'active') {
                dropdown.current.dataset.ui = '';
                dropdownArrow.current.dataset.ui = '';
            }

            setOpen(false);
        }
    }
    
    useEffect(() => {
        addEventListener('click', focusOutside);
        return () => removeEventListener('click', focusOutside);
    }, []);

    return (
        <div ref={ dropdown } className={ `relative flex ${ className }`}>
            <input value={ hour } onChange={ ev => setHour(inputValidate(ev, 1, 12)) } className="border-[1px] border-neutral-600 text-[16px] w-[30px] p-1 rounded-sm" />
            <span className="w-2 text-center text-xl font-semibold leading-none mt-1">:</span>
            <input value={ minute } onChange={ ev => setMinute(inputValidate(ev, 0, 59)) }className="border-[1px] border-neutral-600 text-[16px] w-[30px] p-1 rounded-sm" />
            <input value={ meridiem } onChange={ ev => meridiemValidate(ev) }className="border-[1px] ml-1 border-neutral-600 text-[16px] w-[34px] p-1 rounded-sm" />
            <button onClick={ toggle } className="p-1 flex items-center justify-between focus:outline-none">
                <span ref={ dropdownArrow } className="data-active:rotate-[360deg] transition-transform">
                    <Clock size="24" />
                </span>
            </button>
            <div className={ `absolute mt-[40px] py-1 border border-neutral-300 shadow-lg bg-white ${ open ? 'flex' : 'hidden' }` }>
                <div className="hide-scrollbar flex h-[100px] overflow-auto">
                    <article ref={ hourNumsCont } className="flex flex-col px-1">
                        {
                            Array(12).fill(0).map((_, index) => {
                                const hour = index + 1;
                                const fHour = hour.toString().padStart(2, '0');
                                return <span key={ index } onClick={ ev => setSelectedHour(ev, fHour) } className="font-headings text-sm p-1">{ fHour }</span>
                            })
                        }
                    </article>
                </div>
                <div className="hide-scrollbar flex h-[100px] overflow-auto">
                    <article ref={ minuteNumsCont } className="flex flex-col px-1">
                        {
                            Array(60).fill(0).map((_, minute) => {
                                const fMinute = minute.toString().padStart(2, '0');
                                return <span key={ minute } onClick={ ev => setSelectedMinute(ev, fMinute) } className="font-headings text-sm p-1">{ fMinute }</span>
                            })
                        }
                    </article>
                </div>
                <div className="hide-scrollbar flex h-[100px] overflow-auto">
                    <article className="flex flex-col px-1">
                        <span onClick={ ev => meridiemSelection(ev, 'am') } className="am font-headings text-sm p-1">am</span>
                        <span onClick={ ev => meridiemSelection(ev, 'pm') } className="pm font-headings text-sm p-1">pm</span>
                    </article>
                </div>
            </div>
        </div>
    );
}

export default TimePicker;