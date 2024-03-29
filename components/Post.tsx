import { useMutation } from "@apollo/client";
import Image from "next/image";
import { useState } from "react";
import { DELETE_POST, GET_POSTS } from "../graphql/posts";
import { SessionData } from "../pages/api/session/types";

import { DeletePostMutation, DeletePostMutationVariables, GetPostsQuery, GetUserByIdQuery } from "../types/generated/graphql";
import { Button } from "./Button";
import { H1 } from "./H1";
import PostForm from "./PostForm";
import { Markdown } from "./Markdown";
type Post = GetPostsQuery['posts_connection']['edges'][0]['node']

type Props = {
    post: Post
    session?: SessionData
    preview?: boolean
}



export const Post = ({ post, session, preview }: Props) => {

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
            {session && <PostForm
                originalBody={body}
                session={session}
                originalPrice={price}
                onAfterSave={() => setIsEdit(false)}
                originalDescription={description}
                originalPhoto={photo_url}
                originalTitle={title}
                postId={post_id}
            />}
            <Button onClick={e => setIsEdit(false)}>Cancel</Button>
        </div>
    )

    return (
        <div className="container flex flex-col mt-36 pb-96 bg-white min-h-screen">
            {session?.is_admin && <Button className="ml-4" onClick={handleDelete}>{deleting ? "Deleting" : "Delete"}</Button>}
            {session?.is_admin && <Button className="ml-4" onClick={e => setIsEdit(true)}>Edit</Button>}
            {/* PHOTO */}
            <div className="z-0 h-96 w-full bg-white shadow-md">
                <div className="relative w-full h-full">
                    {post.photo_url && <Image priority className=" p-6" src={!preview ? `/api/images/${post.photo_url}` : post.photo_url} alt="" layout="fill" objectFit={post.is_blog ? 'cover' : "scale-down"} />}
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
