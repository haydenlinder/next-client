import { useReactiveVar } from "@apollo/client";
import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { VerifyResponse } from "./api/session/verify";

const verify = async () => {
    const res = await fetch(`${window.location.origin}/api/session/verify${window.location.search}`)
    const data: VerifyResponse = await res.json();
    return data;
}

const Verify: NextPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
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
    }, []);

    if (loading) return <div className="pt-36">Loading...</div>
    if (error) return <p className="pt-36">error</p>
        
    return (
        <section className="pt-36">
            <h1>Success!</h1>
            <Link href="/login" passHref><Button>Log In</Button></Link>
        </section>
    )
};

export default Verify;