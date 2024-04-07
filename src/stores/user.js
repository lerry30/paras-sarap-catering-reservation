import { getData } from '@/utils/send';
import { create } from 'zustand';

export const zUserData = create(set => ({
    firstname: '',
    lastname: '',
    email: '',
    fullname: '',

    saveUserData: async () => {
        const isLocalUserDataExist = (Object.keys(JSON.parse(localStorage.getItem('user-data') || '{}')).length > 0);
        if(!isLocalUserDataExist) {
            const { data } = await getData('/api/users/user');
            localStorage.setItem('user-data', JSON.stringify(data));
        }
        
        const { firstname, lastname, email } = JSON.parse(localStorage.getItem('user-data') || '{}');

        set(state => {
            const fullname = createFullname(firstname, lastname);
            return { firstname, lastname, email, fullname };
        });
    },

    wipeOutData: () => {
        set(() => ({ firstname: '', lastname: '', email: '', fullname: '' }));
    }
}));

function createFullname(firstname, lastname) {
    if(!firstname || !lastname) return '';
    const fName = titleFormat(firstname);
    const lName = titleFormat(lastname);
    const fullName = fName + ' ' + lName;

    return fullName;
}

function titleFormat(uname) {
    const lName = uname.toLowerCase().split(' ');

    let fname = '';
    for(const name of lName) {
        fname = fname + ' ' + name[0].toUpperCase() + name.substring(1);
    }

    return fname;
}