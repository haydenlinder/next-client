import type { GetStaticProps, NextPage } from "next";
import {
    GetPostsQuery,
} from "../../types/generated/graphql";
import { GET_POSTS } from "../../graphql/posts";
import { PostPreview } from "../../components/PostPreview";
import { serverClient } from "../api/apollo-client";
import { H1 } from "../../components/H1";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import { ItemList, WithContext } from "schema-dts";

type Props = {
    posts: GetPostsQuery['posts_connection']['edges'][0]['node'][]
}

export const getStaticProps: GetStaticProps<Props> = async ({  }) => {
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
    const jsonLd: WithContext<ItemList> = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: posts.map((post,i) =>
            ({
                "@type": "ListItem",
                "position": i+1,
                "item": {
                    "@type": "Course",
                    "url": `https://www.worldcodecamp.com/courses/${post.post_id}`,
                    "name": post.title,
                    "description": post.description,
                    "provider": {
                        "@type": "Organization",
                        "name": "World Code Camp",
                        "sameAs": "https://www.worldcodecamp.com"
                    }
                }
            })
        )
    }
    return (
        <>
            <Head>
                <title>Learn to Code | Courses</title>
                <meta
                    name="description"
                    content="Courses" 
                />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Head>
            <section className="w-full py-20 container pb-36 flex flex-col items-center">
                <H1 className="mb-10 text-center">Courses</H1>
                {loading && <div>loading...</div>}
                <div className="grid auto-rows-fr md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(clientPosts || posts)?.map((post, i) => <PostPreview priority={i == 0} key={post.id} post={post} />)}
                </div>
            </section>
        </>
    );
};

export default Courses;
