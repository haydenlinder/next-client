import Link from "next/link"
import Router from "next/router";
import { GetUserByIdQuery } from "../types/generated/graphql";
import { Button } from "./Button";

type HeaderProps = {
    accessToken: string | undefined
    user: GetUserByIdQuery['users_connection']['edges'][0]['node']
}

const logout = async () => {
    const response = await fetch('/api/session/logout', { method: 'POST' });
    await response.json();
    Router.replace('/')
}

export const Header = ({ accessToken, user }: HeaderProps) => {

    return (
        <header className="p-4 flex justify-center bg-black text-white absolute w-full top-0 z-10">
            <nav className="container flex items-center justify-between">
                <Link passHref href="/">
                    <a className="mr-2">
                        Home
                    </a>
                </Link>
                {Boolean(accessToken) ?
                    <div>
                        <Link passHref href={`/users/${user?.user_id}`}>
                            <a className="mr-2 hover:underline">
                                {user?.username || "Profile"}
                            </a>
                        </Link>
                        {user.is_admin && <Link passHref href='/admin'>
                            <a className="mr-2 hover:underline">
                                Admin
                            </a>
                        </Link>}
                        <Button className="mr-2 border-white" onClick={e => logout()}>Logout</Button>
                    </div>
                    : 
                    <Link passHref href='/login'>
                        <a className="mr-2 hover:underline">
                            Log In
                        </a>
                    </Link>
                }
            </nav>
        </header>
    )
}