import { create } from 'zustand';
import { drink as localStorageName } from '@/utils/localStorageNames';

export const zDrink = create(set => ({
    id: '',
    name: '',
    description: '',
    filename: '',
    costperhead: 0,
    status: 'available',

    init: () => {
        try {
            set(state => !state.id ? JSON.parse(localStorage.getItem(localStorageName)) || {} : state);
        } catch(error) {}
    },

    saveDrinkData: ({ id, name, description, filename, costperhead, status }) => {
        if(!id || !name || !description || !filename || !costperhead) return false;
        const data = { id, name, description, filename, costperhead, status };
        localStorage.setItem(localStorageName, JSON.stringify(data));
        set(data);
        return true;
    },
}));