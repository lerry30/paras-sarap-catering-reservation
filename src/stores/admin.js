import { create } from 'zustand';

export const zAdmin = create(set => ({
    signiture: undefined,

    setSigniture: () => {
        const isSigned = !!localStorage?.getItem('signiture');
        if(isSigned) {
            const key = `__${ crypto.randomBytes(16).toString('hex') } `;
            localStorage?.setItem('signiture', key);
        }

        const key = localStorage?.getItem('signiture');
        set(state => ({ ...state, signiture: key }));
    }
}));