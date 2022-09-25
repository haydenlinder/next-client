import type { GetStaticProps, NextPage } from "next";
import {
    GetPostByIdQuery,
    GetPostByIdQueryVariables,
    GetPostsQuery,
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
import { WithContext, Course } from "schema-dts";
import { useStore } from "../../state/store";

type Props = { post?: TPost | null, error?: number }

export async function getStaticPaths() {
    const { data } = await serverClient.query<GetPostsQuery>({
        query: GET_POSTS
    })
    const ids = data.posts_connection.edges.map(e => e.node.post_id)
    return {
        paths: ids.map(id => `/courses/${id}`),
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
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        setIsModalOpen(!accessToken)
    }, [accessToken])

    if (!post && (!isModalOpen)) return (
        <div className="pt-36 flex flex-col items-center">
            <H2 className="text-center">{error || "Error"}</H2>
        </div>
    )

    const jsonLd: WithContext<Course> = {
        "@context": "https://schema.org",
        "@type": "Course",
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
                <Modal
                    shouldCloseOnEsc={false}
                    appElement={(typeof document !== 'undefined') && document.getElementById('modal-container') || undefined}
                    className="mt-36 mx-auto p-10 bg-white flex h-[70vh] flex-col items-center justify-center container drop-shadow-lg"
                    isOpen={isModalOpen}
                    // onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Log In"
                    overlayClassName='bg-black w-full h-full absolute top-0 bg-opacity-70'
                >
                    <H2 className="text-center">Please sign in to view this content</H2>
                    <LoginForm onSuccess={() => setIsModalOpen(false)} />
                </Modal>
                {post && <Post post={post}/>}
            </div>
        </>
    );
};

export default Course;
