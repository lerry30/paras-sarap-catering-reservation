import { create } from 'zustand';

export const zDish = create(set => ({
    id: '',
    name: '',
    description: '',
    allergens: [],
    filename: '',
    costperhead: 0,
    status: 'available',

    init: () => {
        try {
            console.log('init');
            set(state => !state.id ? JSON.parse(localStorage.getItem('dish-update-data')) || {} : state);
        } catch(error) {}
    },

    saveDishData: ({ id, name, description, allergens, filename, costperhead, status }) => {
        if(!id || !name || !description || !filename || !costperhead) return false;
        const data = { id, name, description, allergens, filename, costperhead, status };
        localStorage.setItem('dish-update-data', JSON.stringify(data));
        set(data);
        return true;
    },
}));