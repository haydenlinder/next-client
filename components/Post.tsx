import { useMutation, useReactiveVar } from "@apollo/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { DELETE_POST, GET_POSTS } from "../graphql/posts";
import { currentUserIdState } from "../token";
import { DeletePostMutation, DeletePostMutationVariables, GetPostsQuery } from "../types/generated/graphql";
import { Button } from "./Button";
type Post = GetPostsQuery['posts_connection']['edges'][0]['node']

type PostProps = {
    post: Post
}

export const Post = ({post}: PostProps) => {
    const currentUserId = useReactiveVar(currentUserIdState);

    const [deletePost, { loading: deleting }] = useMutation<DeletePostMutation, DeletePostMutationVariables>(DELETE_POST, {
        refetchQueries: [
            GET_POSTS
        ]
    });

    return (
        <Link passHref href={`/posts/${post.id}`} key={post.id} >
            <div className="border border-black rounded p-4 mb-4">
                <ReactMarkdown components={{
                    h1: ({ node, ...props }) => <h1 className='font-bold text-lg' {...props} />,
                    a: ({ node, ...props }) => <a className='text-blue-600 hover:underline text-lg' {...props} />
                }}>{post.body}</ReactMarkdown>
                <Button>{post.price}</Button>
                {post.photo_url && <img src={`/api/images/${post.photo_url}`} alt="" height={500} width={500} />}
                {post.user_id === currentUserId &&  <Button className="mt-4" onClick={() => deletePost({ variables: { post_id: post.post_id } })}>{deleting ? "Deleting" : "Delete"}</Button>}
            </div>
        </Link>
    )
}
