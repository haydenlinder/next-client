import type { GetServerSideProps, NextPage } from "next";
import { getCookieParser } from "next/dist/server/api-utils";
import { H1 } from "../components/H1";
import PostForm from "../components/PostForm";
import { Button } from "../components/Button";
import { SessionData } from "./api/session/types";
import jwt from 'jsonwebtoken'
import { useState } from "react";

type Props = {
    session: SessionData | undefined
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
    const cookies = getCookieParser(req.headers)()
    const accessToken = cookies.access_token
    
    let session: SessionData | undefined;
    try {
        session = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as SessionData;
    } catch (e) {
        console.error("auth error: ", e)
    }

    return (
        {
            props: {
                session
            }
        }
    )
}

const Admin: NextPage<Props> = ({ session }) => {
    const [showForm, setShowForm] = useState(false)

    return (
        <section className="container py-36">
            <H1>Admin</H1>
            {showForm && session && <PostForm session={session}/>}
            <Button
                secondary={showForm}
                className="pt-4" 
                onClick={() => setShowForm(s => !s)}
            >
                {showForm ? "Cancel" : "New Post"}
            </Button>
        </section>
    );
};

export default Admin;
