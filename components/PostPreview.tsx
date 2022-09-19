import { useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DELETE_POST, GET_POSTS } from "../graphql/posts";
import { SessionData } from "../pages/api/session/types";
import { useStore } from "../state/store";

import { DeletePostMutation, DeletePostMutationVariables, GetPostsQuery, GetUserByIdQuery } from "../types/generated/graphql";
import { Button, ButtonLink } from "./Button";
import { H2 } from "./H2";
import PostForm from "./PostForm";

type Post = GetPostsQuery['posts_connection']['edges'][0]['node']

type Props = {
    post: Post
    session?: SessionData | undefined
    priority?: boolean
    preview?: boolean
}

export const PostPreview = ({post, priority, preview}: Props) => {
    const { session } = useStore()
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

    const { description, title, price, photo_url, post_id, body} = post;

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
        <div className="flex flex-col w-full items-center rounded min-h-fit mb-4 drop-shadow-2xl">
            {/* PHOTO */}
            <div className="p-6 z-0 h-52 rounded-t w-full bg-white shadow-md">
                <div className="relative w-full h-full">
                    {post.photo_url && <Image className="rounded-t" priority={priority} src={!preview ? `/api/images/${post.photo_url}`: post.photo_url} alt="" layout="fill" objectFit='scale-down' />}
                </div>
            </div>
            {/* POST INFO */}
            <div className="w-full flex min-h-[200px] justify-between items-center bg-white p-10">
                <div>
                    <H2>{post.title}</H2>
                    <p>{post.description}</p>
                </div>
                {/* BUTTONS */}
                <div className="ml-4">
                    <Link passHref href={`/courses/${post.post_id}`}><ButtonLink>{post.price <= 0 ? "FREE!" : post.price}</ButtonLink></Link>
                    {session?.is_admin &&  <Button className="my-4" onClick={handleDelete}>{deleting ? "Deleting" : "Delete"}</Button>}
                    {session?.is_admin &&  <Button className="mb-4" onClick={e => setIsEdit(true)}>Edit</Button>}
                </div>
            </div>
        </div>
    )
}
