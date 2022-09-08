import Router from "next/router";
import { AppState, useStore } from "../../state/store";

type LogoutParams = Pick<AppState, 'setAccessToken' | 'setUser'>

export const logout = async ({setAccessToken, setUser}: LogoutParams) => {
    setUser(undefined)
    setAccessToken(undefined)
    const response = await fetch('/api/session/logout', { method: 'POST' });
    await response.json();
    Router.replace('/login')
}