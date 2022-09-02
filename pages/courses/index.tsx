import type { GetServerSideProps, NextPage } from "next";
import {
    GetPostsQuery,
} from "../../types/generated/graphql";
import { GET_POSTS } from "../../graphql/posts";
import { PostPreview } from "../../components/PostPreview";
import { serverClient } from "../api/apollo-client";
import { H1 } from "../../components/H1";
import { useQuery } from "@apollo/client";

type Props = {
    posts: GetPostsQuery['posts_connection']['edges'][0]['node'][]
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
    const { data } = await serverClient.query<GetPostsQuery>({
        query: GET_POSTS,
        context: { headers: { 'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET } }
    })
    return (
        {
            props: {
                posts: data.posts_connection.edges.map(e => e.node)
            }
        }
    )
}

const Courses: NextPage<Props> = ({ posts }) => {
    const { data, loading } = useQuery<GetPostsQuery>(GET_POSTS)
    const clientPosts = data?.posts_connection.edges.map(e => e.node);
    return (
        <section className="w-full pt-36 container">
            <H1 className="mb-10 text-center">Courses</H1>
            {loading && <div>loading...</div>}
            {(clientPosts || posts)?.map(post => <PostPreview key={post.id} post={post} />)}
        </section>
    );
};

export default Courses;
