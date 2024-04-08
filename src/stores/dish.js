import { create } from 'zustand';

export const zDish = create(set => ({
    id: '',
    name: '',
    description: '',
    allergens: [],
    filename: '',
    costperhead: 0,

    saveDishData: ({ id, name, description, allergens, filename, costperhead }) => {
        if(!id || !name || !description || !filename || !costperhead) return false;
        set(state => ({ id, name, description, allergens, filename, costperhead }));
        return true;
    }
}));