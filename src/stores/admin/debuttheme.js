import { create } from 'zustand';
import { debutthemes as localStorageName } from '@/utils/localStorageNames';

export const zDebutTheme = create(set => ({
    id: '',
    name: '',
    description: '',
    filename: '',

    init: () => {
        try {
            set(state => !state.id ? JSON.parse(localStorage.getItem(localStorageName)) || {} : state);
        } catch(error) {}
    },  

    saveDebutThemeData: ({ id, name, description, filename }) => {
        if(!id || !name || !description || !filename) return false;
        const data = { id, name, description, filename };
        localStorage.setItem(localStorageName, JSON.stringify(data));
        set(data);
        return true;
    },
}));
