import { useReactiveVar } from "@apollo/client";
import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { accessTokenState } from "../token";
import { VerifyResponse } from "./api/session/verify";

const verify = async () => {
    const res = await fetch(`${window.location.origin}/api/session/verify${window.location.search}`)
    const data: VerifyResponse = await res.json();
    return data;
}

const Verify: NextPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const accessToken = useReactiveVar(accessTokenState);

    useEffect(() => {
        if (accessToken) {
            Router.replace('/')
        }
        (async () => {
            try {
                const data = await verify();
                if (data.errors) setError(data.errors)
            } catch (e) {
                const er = e as string;  
                console.error(er)
                setError(er)
            } finally {
                setLoading(false);
            }
        })();
    }, [accessToken]);

    if (loading) return <div>Loading...</div>
    if (error) return <p>error</p>
        
    return (
        <section>
            <h1>Success!</h1>
            <Link href="/login" passHref><Button>Log In</Button></Link>
        </section>
    )
};

export default Verify;