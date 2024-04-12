import { create } from 'zustand';

const localStorageName = 'menu-update-data';
export const zMenu = create(set => ({
    id: '',
    name: '',
    description: '',
    dishes: {},
    drinks: {},
    status: 'available',

    init: () => {
        try {
            set(state => JSON.parse(localStorage.getItem(localStorageName)) || {});
        } catch(error) {}
    },

    saveNameNDescription: (name, description) => {
        // if(!name || !description) return false;
        set(state => {
            const data = { ...state, name, description };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });
        // return true;
    },

    saveDishesData: (listOfDishes) => {
        for(const key in listOfDishes) {
            const { _id, name, description, filename, costperhead } = listOfDishes[key];
            if(!_id || !name || !description || !filename || !costperhead) return false;
        }

        set(state => {
            const data = { ...state, dishes: listOfDishes };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });

        return true;
    },

    removeDish: (_id) => {
        if(!_id) return false;
        set(state => {
            const dishes = state?.dishes || {};
            delete dishes[_id];
            const data = { ...state, dishes };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });

        return true;
    },

    saveDrinksData: (listOfDrinks) => {
        for(const key in listOfDrinks) {
            const { _id, name, description, filename, costperhead } = listOfDrinks[key];
            if(!_id || !name || !description || !filename || !costperhead) return false;
        }

        set(state => {
            const data = { ...state, drinks: listOfDrinks };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });

        return true;
    },

    removeDrink: (_id) => {
        if(!_id) return false;
        set(state => {
            const drinks = state?.drinks || {};
            delete drinks[_id];
            const data = { ...state, drinks };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });

        return true;
    },

    clear: () => {
        set({
            name: '',
            description: '',
            dishes: {},
            drinks: {},
        });

        localStorage.removeItem(localStorageName);
    },

    saveId: (id) => {
        if(!id) return false;
        set(state => {
            const data = { ...state, id };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });
        
        return true;
    },
    
    saveStatus: (status) => {
        const statusValues = { available: 'available', unavailable: 'unavailable' };
        const fStatus = statusValues[status] || 'available';
        if(!fStatus) return false;
        set(state => { 
            const data = { ...state, status: fStatus };
            localStorage.setItem(localStorageName, JSON.stringify(data));
            return data;
        });
        
        return false;
    },
}));