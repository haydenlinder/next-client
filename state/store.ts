import create from 'zustand'
import { TokenPayload } from '../pages/api/session/types'

export type AppState = {
    accessToken: string | undefined
    setAccessToken: (accessToken: string | undefined) => void
    setUser: (user: TokenPayload | undefined) => void
    user: TokenPayload | undefined
}

export const useStore = create<AppState>((set) => ({
    user: undefined,
    accessToken: '',
    setUser: (user) => {
        set(() => ({ user }))
    },
    setAccessToken: (accessToken) => {
        set(() => ({ accessToken }))
    },
}))