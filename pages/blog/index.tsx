import type { GetStaticProps, NextPage } from "next";
import {
    GetPostsQuery, GetPostsQueryVariables,
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
    const { data } = await serverClient.query<GetPostsQuery, GetPostsQueryVariables>({
        query: GET_POSTS,
        variables: {
            is_blog: {
                _eq: true
            }
        },
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
    const { data, loading } = useQuery<GetPostsQuery, GetPostsQueryVariables>(GET_POSTS, {
        variables: {
            is_blog: {
                _eq: true
            }
        }
    })
    const clientPosts = data?.posts_connection.edges.map(e => e.node);
    const jsonLd: WithContext<ItemList> = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: posts.map((post,i) =>
            ({
                "@type": "ListItem",
                "position": i+1,
                "item": {
                    "@type": "Article",
                    "author": {
                        "@type": "Person",
                        "name": "Hayden Linder",
                        "jobTitle": "Web Developer",
                        "url": "http://haydenlinder.com"
                    },
                    "headline": post.title,
                    "image": `/api/images/${post.photo_url}`,
                    "url": `https://www.worldcodecamp.com/blog/${post.post_id}`,
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
                <title>Learn to Code | Blog</title>
                <meta
                    name="description"
                    content="Blog" 
                />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Head>
            <section className="w-full py-20 container pb-36">
                <H1 className="mb-10 text-center">Blog</H1>
                {loading && <div>loading...</div>}
                {(clientPosts || posts)?.map((post, i) => <PostPreview priority={i == 0} key={post.id} post={post} />)}
            </section>
        </>
    );
};

export default Courses;
