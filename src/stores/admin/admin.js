import { create } from 'zustand';

export const zAdmin = create(set => ({
    slots: {
        dishes: undefined,
        adddish: undefined,
        updatedish: undefined,
        viewdish: undefined,
        drinks: undefined,
        adddrink: undefined,
        updatedrink: undefined,
        viewdrink: undefined,
        venues: undefined,
        addvenue: undefined,
        updatevenue: undefined,
        viewvenue: undefined,
        viewweddingthemes: undefined,
        menus: undefined,
        addmenu: undefined,
        dishesselection: undefined,
        drinksselection: undefined,
        updatemenu: undefined,
        viewmenu: undefined,
        schedules: undefined,
        dashboard: undefined,
        users: undefined,
    },

    saveSlots: (views) => {
        set(state => ({ slots: views }));
    },
}));