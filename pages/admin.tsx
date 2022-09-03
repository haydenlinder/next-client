import type { GetServerSideProps, NextPage } from "next";
import {
    GetPostsQuery,
} from "../types/generated/graphql";
import { GET_POSTS } from "../graphql/posts";
import { PostPreview } from "../components/PostPreview";
import { serverClient } from "./api/apollo-client";
import { getCookieParser } from "next/dist/server/api-utils";
import { getCurrentUser } from "./api/apollo_functions/users";
import { H1 } from "../components/H1";
import PostForm from "../components/PostForm";
import { Post as TPost, User } from "../types/entities";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Button } from "../components/Button";

type Props = {
    posts: TPost[]
    user: User
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
    const cookies = getCookieParser(req.headers)()
    const token = cookies.access_token

    const { data } = await serverClient.query<GetPostsQuery>({
        query: GET_POSTS,
        context: { headers: { authorization: `Bearer ${token}` } }
    })

    const user = await getCurrentUser(req);

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
        <section className="container pt-36">
            {showForm && <PostForm user={user}/>}
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
