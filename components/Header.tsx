import { useReactiveVar } from "@apollo/client"
import Link from "next/link"
import Router from "next/router";
import { accessTokenState } from "../token"

const logout = async () => {
    const response = await fetch('/api/session/logout');
    await response.json();
    Router.replace('/login')
}

export const Header = () => {
    const accessToken = useReactiveVar(accessTokenState);

    return (
        <header className="p-4 bg-black text-white mb-3 absolute w-full top-0">
            <nav className="container">
                <Link href="/">
                    Home
                </Link>
                {Boolean(accessToken) && <button onClick={e => logout().finally(() => accessTokenState(undefined))}>Logout</button>}
            </nav>
        </header>
    )
}