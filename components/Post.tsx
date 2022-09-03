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
import { Markdown } from "./Markdown";
import PostForm from "./PostForm";

type Post = GetPostsQuery['posts_connection']['edges'][0]['node']
type User = GetUserByIdQuery['users_connection']['edges'][0]['node']

type Props = {
    post: Post
    user?: User
    preview?: boolean
}

export const Post = ({ post, user, preview }: Props) => {

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
        <div className="container flex flex-col py-36 bg-white min-h-screen">
            {user?.is_admin && <Button className="ml-4" onClick={handleDelete}>{deleting ? "Deleting" : "Delete"}</Button>}
            {user?.is_admin && <Button className="ml-4" onClick={e => setIsEdit(true)}>Edit</Button>}
            {/* PHOTO */}
            <div className="p-6 z-0 h-52 w-full bg-white shadow-md">
                <div className="relative w-full h-full">
                    {post.photo_url && <Image className=" p-6" src={!preview ? `/api/images/${post.photo_url}` : post.photo_url} alt="" layout="fill" objectFit='scale-down' />}
                </div>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-200 to-purple-200">
                <H1>{post.title}</H1>
            </div>
            <div className="p-6">
                <Markdown {...{ body }} />
            </div>
        </div>
    )
}
