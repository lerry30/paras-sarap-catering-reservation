import { getData } from '@/utils/send';
import { user as localStorageName } from '@/utils/localStorageNames';
import { create } from 'zustand';
import { createFullname } from '@/utils/name';

export const zUserData = create(set => ({
    firstname: '',
    lastname: '',
    email: '',
    fullname: '',

    saveUserData: async () => {
        try {
            const isLocalUserDataExist = (Object.keys(JSON.parse(localStorage.getItem(localStorageName) || '{}')).length > 0);
            if(!isLocalUserDataExist) {
                const { data } = await getData('/api/users/user');
                localStorage.setItem(localStorageName, JSON.stringify(data));
            }
            
            const { firstname, lastname, email } = JSON.parse(localStorage.getItem(localStorageName) || '{}');

            set(state => {
                const fullname = createFullname(firstname, lastname);
                return { firstname, lastname, email, fullname };
            });
        } catch(error) {
            console.log(error, ', get user data error!');
        }
    },

    wipeOutData: () => {
        set(() => ({ firstname: '', lastname: '', email: '', fullname: '' }));
    }
}));