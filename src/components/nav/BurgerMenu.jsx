import { useState, useRef, useEffect } from 'react';

const BurgerMenu = ({ size='w-[30px]', className='', children }) => {
    const sidebar = useRef(null);
    const burgerStrokeTop = useRef(null);
    const burgerStrokeBottom = useRef(null);
    const [ open, setOpen ] = useState(false);
    // const [ active, setActive ] = useState('');

    const toggle = () => {
        setOpen(state => !state);

        const dataset = !sidebar?.current?.dataset.ui ? 'active' : '';
        sidebar.current.dataset.ui = dataset;
        burgerStrokeTop.current.dataset.ui = dataset;
        burgerStrokeBottom.current.dataset.ui = dataset;
    }

    const focusOutside = (ev) => {
        if(!sidebar?.current?.contains(ev.target)) {
            if(sidebar?.current?.dataset?.ui === 'active') {
                toggle();
            }
        }
    }

    useEffect(() => {
        // if(open) setActive('active');
        addEventListener('click', focusOutside);
        return () => removeEventListener('click', focusOutside);
    }, []);

    return (
        // data-ui={ active } to setting it in open mode
        <div ref={ sidebar } className={`relative ${ className }`}>
            <button onClick={ toggle } className={`${ size } aspect-square rounded-full`}>
                <span ref={ burgerStrokeTop } className="absolute w-6 h-[2px] top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] data-active:rotate-45 transition-transform data-active:top-[50%] bg-black rounded"></span>
                <span ref={ burgerStrokeBottom } className="absolute w-4 h-[2px] top-[60%] left-[50%] translate-x-[-12px] translate-y-[-50%] data-active:-rotate-45 transition-transform data-active:top-[50%] data-active:translate-x-[-50%] data-active:w-6 bg-black rounded"></span>
            </button>
            <div className={ `fixed left-0 w-[230px] h-screen flex flex-col gap-2 mt-2 p-2 pt-6 sm:px-page-x sm:w-[300px] border-r border-neutral-300 shadow-sm bg-white overflow-y-auto transition-transform ${ className } ${ open ? 'translate-x-0' : '-translate-x-full' }` }>
                { children }
            </div>
        </div>
    );
}

export default BurgerMenu;