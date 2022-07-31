import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DELETE_POST, GET_POSTS } from "../graphql/posts";
import { DeletePostMutation, DeletePostMutationVariables, GetPostsQuery } from "../types/generated/graphql";
type Post = GetPostsQuery['posts_connection']['edges'][0]['node']

type PostProps = {
    post: Post
}

const getPhoto = async (key: string | undefined | null) => {
    try {
        const res = await fetch(`/api/images/${key}`);
        const data = await res.json()
        return data;
    } catch (e) {
        console.error(e)
    }
}

export const Post = ({post}: PostProps) => {
    const [deletePost, { loading: deleting }] = useMutation<DeletePostMutation, DeletePostMutationVariables>(DELETE_POST, {
        refetchQueries: [
            GET_POSTS
        ]
    });

    return (
        <div key={post.id} className="border border-black rounded p-4 mb-4">
            <h2>Author: <Link className="text-blue underline" href={`/users/${post.user_id}`}>{post.user.username}</Link></h2>
            <h3>Created: {post.created_at}</h3>
            <p>Body: {post.body}</p>
            {post.photo_url && <img src={`/api/images/${post.photo_url}`} alt="" height={500} width={500} />}
            <button className="border p-2 rounded mt-4" onClick={() => deletePost({ variables: { post_id: post.post_id } })}>{deleting ? "Deleting" : "Delete"}</button>
        </div>
    )
}
