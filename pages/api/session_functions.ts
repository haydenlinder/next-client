import Router from "next/router";
import { AppState, useStore } from "../../state/store";

type LogoutParams = Pick<AppState, 'setAccessToken' | 'setSession'>

export const logout = async ({setAccessToken, setSession}: LogoutParams) => {
    setSession(undefined)
    setAccessToken(undefined)
    const response = await fetch('/api/session/logout', { method: 'POST' });
    await response.json();
    Router.replace('/login')
}