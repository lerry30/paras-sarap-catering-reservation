import { zUserData } from "@/stores/user";
import * as localStorageNames from '@/utils/localStorageNames';

const signout = async () => {
    zUserData.getState().wipeOutData();
    
    for(const key in localStorageNames) {
        const name = localStorageNames[key];
        localStorage.removeItem(name);
    }

    const response = await fetch('/api/users/signout', { method: 'POST' });
    return !!response?.success;
}

export default signout;