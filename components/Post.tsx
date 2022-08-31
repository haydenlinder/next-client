import { useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DELETE_POST, GET_POSTS } from "../graphql/posts";

import { DeletePostMutation, DeletePostMutationVariables, GetPostsQuery, GetUserByIdQuery } from "../types/generated/graphql";
import { Button } from "./Button";
import { H2 } from "./H2";
import PostForm from "./PostForm";

type Post = GetPostsQuery['posts_connection']['edges'][0]['node']
type User = GetUserByIdQuery['users_connection']['edges'][0]['node']

type PostProps = {
    post: Post
    user?: User
}

export const Post = ({post, user}: PostProps) => {

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
    )

    return (
        <div className="flex flex-col items-center border border-black rounded mb-4">
            {/* CONTENT */}
            <div className="relative z-0 h-36 w-full">
                {post.photo_url && <Image src={`/api/images/${post.photo_url}`} alt="" layout="fill" objectFit='scale-down' />}
            </div>
            <div className="flex justify-between items-center bg-gray-200 p-4">
                <div>
                    <H2>{post.title}</H2>
                    <p>{post.description}</p>
                </div>
                {/* BUTTONS */}
                <div>
                    <Button className="bg-yellow-500">{post.price <= 0 ? "FREE!" : post.price}</Button>
                    {user?.is_admin &&  <Button className="ml-4" onClick={handleDelete}>{deleting ? "Deleting" : "Delete"}</Button>}
                    {user?.is_admin &&  <Button className="ml-4" onClick={e => setIsEdit(true)}>Edit</Button>}
                </div>
            </div>
        </div>
    )
}
