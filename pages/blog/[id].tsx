import type { GetStaticProps, NextPage } from "next";
import {
    GetPostByIdQuery,
    GetPostByIdQueryVariables,
    GetPostsQuery,
    GetPostsQueryVariables,
} from "../../types/generated/graphql";
import { serverClient } from "../api/apollo-client";
import { GET_POSTS, GET_POST_BY_ID } from "../../graphql/posts";
import { Post as TPost } from "../../types/entities";
import LoginForm from "../../components/LoginForm";
import { H2 } from "../../components/H2";
import { Post } from "../../components/Post";
import Head from "next/head";
import Modal from 'react-modal'
import { useEffect, useState } from "react";
import { WithContext, Article } from "schema-dts";
import { useStore } from "../../state/store";

type Props = { post?: TPost | null, error?: number }

export async function getStaticPaths() {
    const { data } = await serverClient.query<GetPostsQuery, GetPostsQueryVariables>({
        query: GET_POSTS,
        variables: {
            is_blog: {
                _eq: true
            }
        }
    })
    const ids = data.posts_connection.edges.map(e => e.node.post_id)
    return {
        paths: ids.map(id => `/blog/${id}`),
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    let post: TPost | null = null

    const { data } = await serverClient.query<GetPostByIdQuery, GetPostByIdQueryVariables>({
        query: GET_POST_BY_ID,
        variables: {
            post_id: {
                _eq: Number(params?.id)
            }
        },
        context: { headers: { 'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET } }
    });

    post = data.posts_connection.edges[0]?.node || null

    if (!post) return ({
        props: {
            error: 404
        }
    })
    return ({
        props: {
            post: post
        }
    })
}

const Course: NextPage<Props> = ({ post, error }) => {
    const { accessToken } = useStore()

    if (!post) return (
        <div className="pt-36 flex flex-col items-center">
            <H2 className="text-center">{error || "Error"}</H2>
        </div>
    )

    const jsonLd: WithContext<Article> = {
        "@context": "https://schema.org",
        "@type": "Article",
        "name": post?.title,
        "description": post?.description,
        "provider": {
            "@type": "Organization",
            "name": "World Code Camp",
            "sameAs": "http://www.worldcodecamp.com"
        }
    }

    return (
        <>
            <Head>
                <title>Learn to Code | {post?.title}</title>
                <meta
                    name="description"
                    content={post?.description}
                />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Head>
            <div className="container">
                {post && <Post post={post}/>}
            </div>
        </>
    );
};

export default Course;
