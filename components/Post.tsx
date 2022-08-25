import { useMutation, useReactiveVar } from "@apollo/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { DELETE_POST, GET_POSTS } from "../graphql/posts";

import { DeletePostMutation, DeletePostMutationVariables, GetPostsQuery, GetUserByIdQuery } from "../types/generated/graphql";
import { Button } from "./Button";
type Post = GetPostsQuery['posts_connection']['edges'][0]['node']
type User = GetUserByIdQuery['users_connection']['edges'][0]['node']

type PostProps = {
    post: Post
    user?: User
}

export const Post = ({post, user}: PostProps) => {

    const [deletePost, { loading: deleting }] = useMutation<DeletePostMutation, DeletePostMutationVariables>(DELETE_POST, {
        refetchQueries: [
            GET_POSTS
        ]
    });

    return (
        <Link passHref href={`/posts/${post.id}`} key={post.id}>
            <div className="flex items-center justify-between border border-black rounded p-4 mb-4">
                {/* CONTENT */}
                <div>
                    {post.photo_url && <img src={`/api/images/${post.photo_url}`} alt="" height={500} width={500} />}
                    <ReactMarkdown components={{
                        h1: ({ node, ...props }) => <h1 className='font-bold text-lg' {...props} />,
                        a: ({ node, ...props }) => <a className='text-blue-600 hover:underline text-lg' {...props} />
                    }}>{post.body}</ReactMarkdown>
                </div>
                {/* BUTTONS */}
                <div>
                    <Button className="bg-yellow-500">{post.price <= 0 ? "FREE!" : post.price}</Button>
                    {post.user_id === user?.user_id &&  <Button className="ml-4" onClick={() => deletePost({ variables: { post_id: post.post_id } })}>{deleting ? "Deleting" : "Delete"}</Button>}
                </div>
            </div>
        </Link>
    )
}
