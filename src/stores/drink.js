import { create } from 'zustand';

export const zDrink = create(set => ({
    id: '',
    name: '',
    description: '',
    filename: '',
    costperhead: 0,
    status: 'available',

    init: () => {
        try {
            set(state => !state.id ? JSON.parse(localStorage.getItem('drink-update-data')) || {} : state);
        } catch(error) {}
    },

    saveDrinkData: ({ id, name, description, filename, costperhead, status }) => {
        if(!id || !name || !description || !filename || !costperhead) return false;
        const data = { id, name, description, filename, costperhead, status };
        localStorage.setItem('drink-update-data', JSON.stringify(data));
        set(data);
        return true;
    },
}));