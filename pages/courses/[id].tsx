import type { GetServerSideProps, NextPage } from "next";
import {
    GetPostByIdQuery,
    GetPostByIdQueryVariables,
} from "../../types/generated/graphql";
import { serverClient } from "../api/apollo-client";
import { refresh } from "../api/next-client";
import { GET_POST_BY_ID } from "../../graphql/posts";
import { Post as TPost } from "../../types/entities";
import { PostPreview } from "../../components/PostPreview";
import LoginForm from "../../components/LoginForm";
import { H2 } from "../../components/H2";
import { Post } from "../../components/Post";

type Props = { post?: TPost, error?: number }

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, params }) => {
    const response = await refresh(req?.headers.cookie);
    const accessToken = response?.data?.access_token;

    let post: TPost | null;

    if (accessToken) {
        const { data } = await serverClient.query<GetPostByIdQuery, GetPostByIdQueryVariables>({
            query: GET_POST_BY_ID,
            variables: {
                post_id: {
                    _eq: Number(params?.id)
                }
            },
            context: { headers: { authorization: `Bearer ${accessToken}` } }
        });
        post = data.posts_connection.edges[0]?.node || null
        return ({
            props: {
                post: post
            }
        })
    } else {
        return {
            props: {
                error: 401
            }
        }
    }
}

const Course: NextPage<Props> = ({ post, error }) => {

    if (error === 401) return (
        <div className="pt-36 flex flex-col items-center">
            <H2 className="text-center">Please sign in to view this content</H2>
            <LoginForm />
        </div>
    )

    return (
        <div className="container">
            {(!post || error) ? 
                <div className="pt-36">{error || "Post not found"}</div> 
                :
                <Post post={post}/>
            }
        </div>
    );
};

export default Course;
