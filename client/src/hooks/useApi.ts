import { useAuth } from "@clerk/clerk-react";
import api from "../api/api";

export const useAuthenticatedApi = () => {
    const { getToken } = useAuth();

    const authenticatedApi = async (method: string, url: string, data?: any) => {
        const token = await getToken();
        return api({
            method,
            url,
            data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };

    return authenticatedApi;
};
