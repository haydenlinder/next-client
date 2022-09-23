import Link from "next/link"
import { useEffect, useRef } from "react";
import { SessionData } from "../pages/api/session/types";
import { logout } from "../pages/api/session_functions";
import { useStore } from "../state/store";
import { Button, ButtonLink } from "./Button";

export const Header = () => {
    const ref = useRef<HTMLElement | null>(null)
    const { setAccessToken, setSession, session, accessToken } = useStore()
    // fancy header shadow on scroll
    useEffect(() => {
        const listener = (e: Event) => {
            const cl = ref.current?.classList
            const ev = e as unknown as React.KeyboardEvent<HTMLDivElement>
            if (ev.currentTarget?.scrollTop <= 0) {
                cl?.contains("drop-shadow-md") && cl?.remove("drop-shadow-md")
            } else {
                !cl?.contains("drop-shadow-md") && cl?.add("drop-shadow-md")
            }
        }
        document.getElementById('app-scroll-container')?.addEventListener('scroll', listener)
        return () => document.removeEventListener('scroll', listener)
    })
    return (
        <header ref={ref} className="p-4 flex justify-center bg-gradient-to-r from-blue-300 to-purple-300 absolute w-screen top-0 right-0 z-10">
            <nav className="container flex items-center justify-between">
                <Link passHref href="/">
                    <a className="mr-2 text-5xl">
                        🚢
                    </a>
                </Link>
                {Boolean(accessToken) ?
                    <div className="flex items-center">
                        <Link passHref href={`/users/${session?.user_id}`}>
                            <a className="mr-2 hover:underline">
                                Profile
                            </a>
                        </Link>
                        {session?.is_admin && <Link passHref href='/admin'>
                            <a className="mr-2 hover:underline">
                                Admin
                            </a>
                        </Link>}
                        <Button className="mr-2 border-white" onClick={e => logout({ setAccessToken, setSession })}>Logout</Button>
                    </div>
                    : 
                    <div className="flex items-center">
                        <Link passHref href="/courses">
                            <a className="mr-2 hover:underline">
                                Courses
                            </a>
                        </Link>
                        <Link passHref href='/login'>
                            <ButtonLink className="mr-2 w-20">
                                Log In
                            </ButtonLink>
                        </Link>
                    </div>
                }
            </nav>
        </header>
    )
}