import { zUserData } from "@/stores/user";

const signout = async () => {
    zUserData.getState().wipeOutData();
    localStorage.removeItem('user-data');
    const response = await fetch('/api/users/signout', { method: 'POST' });
    return !!response?.success;
}

export default signout;