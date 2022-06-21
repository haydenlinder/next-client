import type { NextPage } from "next";
import {
  CreatePostMutation,
  CreatePostMutationVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
  GetUsersPaginatedQuery, GetUsersPaginatedQueryResult,
} from "../types/generated/graphql";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { GET_USERS } from "../graphql/users";
import { FormEventHandler, useState } from "react";
import { CREATE_POST, GET_POSTS } from "../graphql/posts";
import { currentUserIdState } from "../token";

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

  const [mutate, { loading: saving }] = useMutation<CreatePostMutation, CreatePostMutationVariables>(CREATE_POST, {
    variables: {
      user_id: currentUserId,
      body
    },
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
    mutate();
  }

  const posts = data?.posts_connection.edges.map(e => e.node);

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>Make an entry</h1>
        <label htmlFor="body">Body</label>
        <textarea className="border border-black rounded" onChange={e => setBody(e.target.value)} value={body} name="body" id="body" cols={30} rows={10}/>
        <button>{saving ? "Saving" : "Post"}</button>
      </form>
      <div>
        <h1>Past posts</h1>
        {posts?.map(p => {
          return (
            <div key={p.id} className="border border-black rounded">
              <h2>{p.user.username}</h2>
              <h3>{p.created_at}</h3>
              <p>{p.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default Home;
