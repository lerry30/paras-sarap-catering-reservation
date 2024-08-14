import { create } from 'zustand';
import { reservation as localStorageName } from '@/utils/localStorageNames';

export const zReservation = create(set => ({
    thems: {},
    venue: {},
    menu: {},
    schedule: {},
    noofguest: 0,

    init: () => {
        try {
            set(state => JSON.parse(localStorage.getItem(localStorageName)) || {});
        } catch(error) {}
    },

    saveThemeData: (data) => {
        set(state => {
            const nData = { ...state, theme: data };
            localStorage.setItem(localStorageName, JSON.stringify(nData));
            return nData;
        });
    },

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

    saveScheduledDateData: (data) => {
        set(state => {
            const nData = { ...state, schedule: data };
            localStorage.setItem(localStorageName, JSON.stringify(nData));
            return nData;
        });
    },

    saveNoOfGuest: (noOfGuest) => {
        set(state => {
            const data = { ...state, noofguest: noOfGuest };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });
    },

    clearSpecificProperty: (prop) => {
        if(!prop) return false;
        set(state => {
            const data = JSON.parse(localStorage.getItem(localStorageName)) || {};
            delete data[prop];
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });

        return true;
    },
}));
