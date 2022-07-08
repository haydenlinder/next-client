import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

const verify = async () => {
    const res = await fetch(`${window.location.origin}/api/session/verify${window.location.search}`)
    const data = await res.json();
    return data;
}

const Verify: NextPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    console.log("render");

    useEffect(() => {
        (async () => {
            try {
                verify();
            } catch (er) {
                console.log(er)
                // setError(er)
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Loading...</div>
    if (error) return <p>{error}</p>
        
    return (
        <section>
            <Link href="/login" passHref><button>Log In</button></Link>
        </section>
    )
};

export default Verify;