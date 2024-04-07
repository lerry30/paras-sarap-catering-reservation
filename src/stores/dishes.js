import { create } from 'zustand';

export const zDish = create(set => ({
    name: '',
    description: '',
    
}));