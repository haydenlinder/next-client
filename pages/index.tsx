import type { GetServerSideProps, NextPage } from "next";
import {
  GetPostsQuery,
} from "../types/generated/graphql";
import { GET_POSTS } from "../graphql/posts";
import { Post } from "../components/Post";
import { serverClient } from "./api/apollo-client";
import { H1 } from "../components/H1";
import { useQuery } from "@apollo/client";
import { Button } from "../components/Button";
import Link from "next/link";

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
  const { data, loading } = useQuery<GetPostsQuery>(GET_POSTS)
  const clientPosts = data?.posts_connection.edges.map(e => e.node);
  return (
    <section className="w-full flex flex-col items-center">
        <H1 className="text-7xl text-center my-4 mb-6">Learn to Code</H1>
        <p className="text-center mb-4">
          Hop on the fast track to a high-paying career with work-life balance.
        </p>
        <p className="text-center mb-4">
          Learn just what you need to land the job and succeed in the workplace - no outdated tech or useless exercises.
        </p>
        <Link passHref href='/courses'>
          <Button>View Courses</Button>
        </Link>
    </section>
  );
};

export default Home;
