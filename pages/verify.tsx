import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "../components/Button";
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

    let gtag: any;
    if (typeof window !== 'undefined') gtag = window.gtag

    useEffect(() => {
        if (loading || error) return;
        gtag && convert()
    }, [loading, error, gtag])

    const convert = () => {
        if (typeof window === "undefined") return
        // ads conversion
        window.gtag('event', 'conversion', {'send_to': 'AW-10993707250/re80COKluuEDEPLRmvoo'});
    }

    if (loading) return <div className="pt-36">Loading...</div>
    if (error) return <p className="pt-36">error</p>

    return (
        <section className="pt-36">
            {}
            <h1>Success!</h1>
            <Link href="/login" passHref><ButtonLink>Log In</ButtonLink></Link>
        </section>
    )
};

export default Verify;