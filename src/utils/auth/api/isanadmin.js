import User from '@/models/Users';
import { decodeUserIdFromRequest } from '@/utils/auth/decode';

export const apiIsAnAdmin = async (request) => {
    try {
        const encodedKey = request.cookies.get('user-json-token-key')?.value || '';
        const encodedData = request.cookies.get('user-json-token-data')?.value || '';

        if(!encodedKey || !encodedData) return false;
        const userId = decodeUserIdFromRequest(encodedKey, encodedData);

        const user = await User.findById(userId);
        if(!user)  return false;

        const isAnAdmin = !!user?.admin;
        return isAnAdmin;
    } catch(error) {
        return false;
    }
}