import { create } from 'zustand';
import { reservation as localStorageName } from '@/utils/localStorageNames';

export const zReservation = create(set => ({
    venue: {},
    menu: {},
    schedule: undefined,

    saveVenueData: (data) => {
        set(state => {
            const nData = { ...state, venue: data };
            localStorage.setItem(localStorageName, JSON.stringify(nData));
            return nData;
        });
    },

    saveMenuData: (data) => {
        set(state => {
            const nData = { ...state, menu: data };
            localStorage.setItem(localStorageName, JSON.stringify(nData));
            return nData;
        });
    },
}));