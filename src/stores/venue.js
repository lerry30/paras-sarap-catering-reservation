import { create } from 'zustand';

const localStorageName = 'venue-update-data';
export const zVenue = create(set => ({
    id: '',
    name: '',
    description: '',
    address: { 
        street: '', 
        barangay: '', 
        municipality: '', 
        province: '', 
        region: '' 
    },
    filename: '',
    maximumSeatingCapacity: 0,
    price: 0,
    chargeForTablesAndChairs: 0,
    status: 'available',

    init: () => {
        try {
            console.log('init venue store');
            set(state => !state.id ? JSON.parse(localStorage.getItem(localStorageName)) || {} : state);
        } catch(error) {}
    },  

    saveVenueData: ({ id, name, description, address, filename, maximumSeatingCapacity, price, chargeForTablesAndChairs, status }) => {
        if(!id || !name || !description || Object.values(address).length === 0 || !filename || !maximumSeatingCapacity || !price) return false;
        const data = { id, name, description, address, filename, maximumSeatingCapacity, price, chargeForTablesAndChairs, status };
        localStorage.setItem(localStorageName, JSON.stringify(data));
        set(data);
        return true;
    },
}));