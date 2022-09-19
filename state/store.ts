import create from 'zustand'
import { SessionData } from '../pages/api/session/types'

export type AppState = {
    accessToken: string | undefined
    setAccessToken: (accessToken: string | undefined) => void
    session: SessionData | undefined
    setSession: (session: SessionData | undefined) => void
}

export let useStore = create<AppState>((set) => ({
    session: undefined,
    accessToken: '',
    setSession: (session) => {
        set(() => ({ session }))
    },
    setAccessToken: (accessToken) => {
        set(() => ({ accessToken }))
    },
}))