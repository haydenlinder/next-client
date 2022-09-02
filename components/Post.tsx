import { useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { DELETE_POST, GET_POSTS } from "../graphql/posts";

import { DeletePostMutation, DeletePostMutationVariables, GetPostsQuery, GetUserByIdQuery } from "../types/generated/graphql";
import { Button } from "./Button";
import { H1 } from "./H1";
import { H2 } from "./H2";
import PostForm from "./PostForm";

type Post = GetPostsQuery['posts_connection']['edges'][0]['node']
type User = GetUserByIdQuery['users_connection']['edges'][0]['node']

type Props = {
    post: Post
    user?: User
}

export const Post = ({ post, user }: Props) => {

    const [isEdit, setIsEdit] = useState(false)

    const [deletePost, { loading: deleting }] = useMutation<DeletePostMutation, DeletePostMutationVariables>(DELETE_POST, {
        refetchQueries: [
            GET_POSTS
        ]
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        deletePost({ variables: { post_id: post.post_id } })
    }

    const { description, title, price, photo_url, post_id, body } = post;

    if (isEdit) return (
        <div>
            <PostForm
                originalBody={body}
                user={user}
                originalPrice={price}
                onAfterSave={() => setIsEdit(false)}
                originalDescription={description}
                originalPhoto={photo_url}
                originalTitle={title}
                postId={post_id}
            />
            <Button onClick={e => setIsEdit(false)}>Cancel</Button>
        </div>
    )

    return (
        <div className="container flex flex-col pt-36 bg-white min-h-screen">
            {/* PHOTO */}
            {user?.is_admin && <Button className="ml-4" onClick={handleDelete}>{deleting ? "Deleting" : "Delete"}</Button>}
            {user?.is_admin && <Button className="ml-4" onClick={e => setIsEdit(true)}>Edit</Button>}
            <div className="p-6 z-0 h-52 w-full bg-white shadow-md">
                <div className="relative w-full h-full">
                    {post.photo_url && <Image className=" p-6" src={`/api/images/${post.photo_url}`} alt="" layout="fill" objectFit='scale-down' />}
                </div>
            </div>
            <div className="p-6">
                <H2>{post.title}</H2>
                <ReactMarkdown className="p-2 my-2 whitespace-pre-wrap" components={{
                    code: ({children, node, ...props}) => <code className="bg-black text-white" {...props}>{children}</code>,
                    br: () => <br />,
                    h1: ({ node, ...props }) => <H1 {...props} />,
                    h2: ({ node, ...props }) => <H2 {...props} />,
                    a: ({ node, ...props }) => <a className='text-blue-600 hover:underline text-lg' {...props} />
                }}>{body}</ReactMarkdown>
            </div>
        </div>
    )
}
