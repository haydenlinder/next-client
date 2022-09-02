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

type Props = {
    post: Post
    user?: User
}

export const PostPreview = ({post, user}: Props) => {

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
        <div className="flex flex-col items-center rounded overflow-hidden min-h-fit mb-4 drop-shadow-2xl">
            {/* PHOTO */}
            <div className="p-6 z-0 h-52 w-full bg-white shadow-md">
                <div className="relative w-full h-full">
                    {post.photo_url && <Image className=" p-6" src={`/api/images/${post.photo_url}`} alt="" layout="fill" objectFit='scale-down' />}
                </div>
            </div>
            <div className="flex justify-between items-center bg-gradient-to-r  from-purple-100 to-blue-100 p-10">
                <div>
                    <H2>{post.title}</H2>
                    <p>{post.description}</p>
                </div>
                {/* BUTTONS */}
                <div className="ml-4">
                    <Link passHref href={`/courses/${post.post_id}`}><Button className=" w-24">{post.price <= 0 ? "FREE!" : post.price}</Button></Link>
                    {user?.is_admin &&  <Button className="ml-4" onClick={handleDelete}>{deleting ? "Deleting" : "Delete"}</Button>}
                    {user?.is_admin &&  <Button className="ml-4" onClick={e => setIsEdit(true)}>Edit</Button>}
                </div>
            </div>
        </div>
    )
}
