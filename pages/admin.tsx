import type { GetServerSideProps, NextPage } from "next";
import {
    GetPostsQuery,
} from "../types/generated/graphql";
import { GET_POSTS } from "../graphql/posts";
import { PostPreview } from "../components/PostPreview";
import { serverClient } from "./api/apollo-client";
import { getCookieParser } from "next/dist/server/api-utils";
import { H1 } from "../components/H1";
import PostForm from "../components/PostForm";
import { Post as TPost, User } from "../types/entities";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Button } from "../components/Button";
import { SessionData } from "./api/session/types";
import jwt from 'jsonwebtoken'

type Props = {
    posts: TPost[]
    session: SessionData | undefined
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
    const cookies = getCookieParser(req.headers)()
    const token = cookies.access_token

    let session: SessionData | undefined;
    const accessToken = cookies.access_token
    try {
        session = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as SessionData;
    } catch (e) {
        console.error("auth error: ", e)
    }

    const { data } = await serverClient.query<GetPostsQuery>({
        query: GET_POSTS,
        context: { headers: { authorization: `Bearer ${token}` } }
    })

    return (
        {
            props: {
                posts: data.posts_connection.edges.map(e => e.node),
                session
            }
        }
    )
}

const Admin: NextPage<Props> = ({ posts, session }) => {
    const { data, loading } = useQuery<GetPostsQuery>(GET_POSTS)
    const [showForm, setShowForm] = useState(false)
    const clientPosts = data?.posts_connection.edges.map(e => e.node);

    return (
        <section className="container py-36">
            {showForm && session && <PostForm session={session}/>}
            <Button
                secondary={showForm}
                className="pt-4" 
                onClick={() => setShowForm(s => !s)}
            >
                {showForm ? "Cancel" : "New Post"}
            </Button>
            <div>
                <H1 className="my-6">Courses</H1>
                {(clientPosts || posts)?.map((post, i) => <PostPreview priority={i == 0} session={session} key={post.id} post={post} />)}
            </div>
        </section>
    );
};

export default Admin;
