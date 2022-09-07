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
import { TokenPayload } from "./api/session/types";
import jwt from 'jsonwebtoken'
import { logout } from "../components/Header";

type Props = {
    posts: TPost[]
    user: TokenPayload | undefined
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
    const cookies = getCookieParser(req.headers)()
    const token = cookies.access_token

    let user: TokenPayload | undefined;
    const accessToken = cookies.access_token
    try {
        user = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as TokenPayload;
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
                user
            }
        }
    )
}

const Admin: NextPage<Props> = ({ posts, user }) => {
    const { data, loading } = useQuery<GetPostsQuery>(GET_POSTS)
    const [showForm, setShowForm] = useState(false)
    const clientPosts = data?.posts_connection.edges.map(e => e.node);

    return (
        <section className="container py-36">
            {showForm && user && <PostForm user={user}/>}
            <Button
                secondary={showForm}
                className="pt-4" 
                onClick={() => setShowForm(s => !s)}
            >
                {showForm ? "Cancel" : "New Post"}
            </Button>
            <div>
                <H1 className="my-6">Courses</H1>
                {(clientPosts || posts)?.map((post, i) => <PostPreview priority={i == 0} user={user} key={post.id} post={post} />)}
            </div>
        </section>
    );
};

export default Admin;
