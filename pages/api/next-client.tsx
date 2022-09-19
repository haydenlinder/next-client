import { RefreshResponse } from "./session/refresh";

const baseUrl = typeof window === 'undefined' ? process.env.BASE_URL : window.location.origin

export const refresh = async (cookie?: string) => {
    const response = await fetch(baseUrl + "/api/session/refresh", cookie ? { headers: { cookie } } : undefined);
    const res: RefreshResponse = await response.json();
    return res;
};
