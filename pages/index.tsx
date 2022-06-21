import type { NextPage } from "next";
import {
  CreatePostMutation,
  CreatePostMutationVariables,
  DeletePostMutation,
  DeletePostMutationVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
  GetUsersPaginatedQuery, GetUsersPaginatedQueryResult,
} from "../types/generated/graphql";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { GET_USERS } from "../graphql/users";
import { FormEventHandler, useState } from "react";
import { CREATE_POST, DELETE_POST, GET_POSTS } from "../graphql/posts";
import { currentUserIdState } from "../token";
import Link from "next/link";

const Home: NextPage = ({ }) => {
  const [body, setBody] = useState("");
  const currentUserId = useReactiveVar(currentUserIdState);

  const { data, loading, error } = useQuery<
    GetPostsQuery,
    GetPostsQueryVariables
  >(GET_POSTS, {
    variables: {
      _gte: 0
    }
  });

  const [savePost, { loading: saving }] = useMutation<CreatePostMutation, CreatePostMutationVariables>(CREATE_POST, {
    variables: {
      user_id: currentUserId,
      body
    },
    refetchQueries: [
      GET_POSTS
    ]
  });
  const [deletePost, { loading: deleting }] = useMutation<DeletePostMutation, DeletePostMutationVariables>(DELETE_POST, {
    refetchQueries: [
      GET_POSTS
    ]
  });


  if (loading) return <div>loading...</div>;

  if (error) {
    console.log({error})
    return <div>no data</div>
  };


  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    savePost();
  }

  const posts = data?.posts_connection.edges.map(e => e.node);

  return (
    <section>
      <form className="mb-8" onSubmit={handleSubmit}>
        <h1>Make an entry</h1>
        <label htmlFor="body">Body</label>
        <textarea placeholder="body" className="border border-black rounded" onChange={e => setBody(e.target.value)} value={body} name="body" id="body" cols={30} rows={10}/>
        <button>{saving ? "Saving" : "Post"}</button>
      </form>
      <div>
        <h1>Past posts</h1>
        {posts?.map(p => {
          return (
            <div key={p.id} className="border border-black rounded p-4 mb-4">
              <h2>Author: <Link className="text-blue underline" href={`/users/${p.user_id}`}>{p.user.username}</Link></h2>
              <h3>Created: {p.created_at}</h3>
              <p>Body: {p.body}</p>
              <button onClick={() => deletePost({ variables: { post_id: p.post_id } })}>{deleting ? "Deleting" : "Delete"}</button>
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default Home;
