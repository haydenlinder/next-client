import type { GetServerSideProps, NextPage } from "next";
import {
  CreatePostMutation,
  CreatePostMutationVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from "../types/generated/graphql";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { FormEventHandler, useEffect, useState } from "react";
import { CREATE_POST, GET_POSTS } from "../graphql/posts";
import { currentUserIdState } from "../token";
import { useDropzone } from "react-dropzone";
import { Post } from "../components/Post";
import { FileResponse } from "./api/images/upload";
import { serverClient } from "./api/apollo-client";
import { getCookieParser } from "next/dist/server/api-utils";


async function uploadImage(file: File) {
  const fakeImageForm = new FormData();
  fakeImageForm.append("image", file, file.name);

  const req = await fetch("/api/images/upload", {
    method: "POST",
    body: fakeImageForm,
  });
  const res: FileResponse = await req.json();

  const key = res.file?.["original.webp"].key

  return key;
}

interface FilePreview extends File {
  preview: string;
}

type Props = {
  posts: GetPostsQuery['posts_connection']['edges'][0]['node'][]
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const cookies = getCookieParser(req.headers)()
  const token = cookies.access_token
  console.log({token})
  const { data } = await serverClient.query<GetPostsQuery>({
    query: GET_POSTS,
    context: { headers: { 'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET } }
  })
  return (
    {
      props: {
        posts: data.posts_connection.edges.map(e => e.node)
      }
    }
  )
}

const Home: NextPage<Props> = ({ posts }) => {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<FilePreview[]>([]);

  const currentUserId = useReactiveVar(currentUserIdState);

  

  const [savePost, { loading: saving }] = useMutation<CreatePostMutation, CreatePostMutationVariables>(CREATE_POST, {
    refetchQueries: [
      GET_POSTS
    ]
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const imageKeys = await Promise.all(files.map(uploadImage));
      savePost({
        variables: {
          body,
          user_id: currentUserId,
          photo_url: imageKeys[0],
        }
      });
    } catch (e) {
      console.error({e})
    }
  }

  return (
    <section>
      <div>
        <h1>Past posts</h1>
        {posts?.map(post => <Post key={post.id} post={post}/>)}
      </div>
    </section>
  );
};






export default Home;
