import { useMutation } from "@apollo/client";
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

    const { description, title, price, photo_url, post_id} = post;

    if (isEdit) return (
        <PostForm 
            user={user} 
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
            {post.photo_url && <img src={`/api/images/${post.photo_url}`} alt="" height={500} width={500} />}
            <div className="flex justify-between items-center bg-gray-200 p-4">
                <div>
                    <H2>{post.title}</H2>
                    <p>{post.description}</p>
                </div>
                {/* BUTTONS */}
                <div>
                    <Button className="bg-yellow-500">{post.price <= 0 ? "FREE!" : post.price}</Button>
                    {post.user_id === user?.user_id &&  <Button className="ml-4" onClick={handleDelete}>{deleting ? "Deleting" : "Delete"}</Button>}
                    {post.user_id === user?.user_id &&  <Button className="ml-4" onClick={e => setIsEdit(true)}>Edit</Button>}
                </div>
            </div>
        </div>
    )
}
