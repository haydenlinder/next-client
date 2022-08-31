import type { GetServerSideProps, NextPage } from "next";
import {
    GetPostsQuery,
} from "../types/generated/graphql";
import { GET_POSTS } from "../graphql/posts";
import { Post } from "../components/Post";
import { serverClient } from "./api/apollo-client";
import { getCookieParser } from "next/dist/server/api-utils";
import { getCurrentUser } from "./api/apollo_functions/users";
import { H1 } from "../components/H1";
import PostForm from "../components/PostForm";
import { Post as TPost, User } from "../types/entities";

type Props = {
    posts: TPost
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

const Home: NextPage<Props> = ({ posts, user }) => {
    
    return (
        <section className="container">
            <PostForm user={user}/>
            <div>
                <H1>Courses</H1>
                {posts?.map(post => <Post user={user} key={post.id} post={post} />)}
            </div>
        </section>
    );
};

export default Home;
