import { create } from 'zustand';

export const zDish = create(set => ({
    id: '',
    name: '',
    description: '',
    allergens: [],
    filename: '',
    costperhead: 0,

    init: () => {
        try {
            set(state => !state.id ? JSON.parse(localStorage.getItem('dish-update-data')) : state);
        } catch(error) {}
    },

    saveDishData: ({ id, name, description, allergens, filename, costperhead }) => {
        if(!id || !name || !description || !filename || !costperhead) return false;
        const data = { id, name, description, allergens, filename, costperhead };
        localStorage.setItem('dish-update-data', JSON.stringify(data));
        set(data);
        return true;
    },
}));