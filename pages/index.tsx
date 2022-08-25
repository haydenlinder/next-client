import type { GetServerSideProps, NextPage } from "next";
import {
  GetPostsQuery,
} from "../types/generated/graphql";
import { GET_POSTS } from "../graphql/posts";
import { Post } from "../components/Post";
import { serverClient } from "./api/apollo-client";

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

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <section className="w-full max-w-2xl">
        <h1>Past posts</h1>
        {posts?.map(post => <Post key={post.id} post={post}/>)}
    </section>
  );
};

export default Home;
