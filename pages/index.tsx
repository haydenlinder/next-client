import type { NextPage } from "next";
import {
  CreatePostMutation,
  CreatePostMutationVariables,
  DeletePostMutation,
  DeletePostMutationVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from "../types/generated/graphql";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { FormEventHandler, useEffect, useState } from "react";
import { CREATE_POST, DELETE_POST, GET_POSTS } from "../graphql/posts";
import { currentUserIdState } from "../token";
import Link from "next/link";
import { useDropzone } from "react-dropzone";

async function uploadImage(file: File) {
  const fakeImageForm = new FormData();
  fakeImageForm.append("image", file, file.name);

  const req = await fetch("/api/images/upload", {
    method: "POST",
    body: fakeImageForm,
  });
  const res = await req.json();

  console.log("Got image upload result:", res);
  const imageUrl = `http://localhost:9000/${res.file["original.webp"].Bucket}/${res.file["original.webp"].Key}`;
  console.log("View image at:", imageUrl);
  return imageUrl;
}

const Home: NextPage = ({ }) => {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  console.log(files)

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

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await Promise.all(files.map(uploadImage));
      console.log({imageUrls});
      savePost({
        variables: {
          body,
          user_id: currentUserId,
          photo_url: imageUrls[0],
        }
      });
    } catch (e) {
      console.log({e})
    }
  }

  const posts = data?.posts_connection.edges.map(e => e.node);

  return (
    <section>
      <form className="mb-8" onSubmit={handleSubmit}>
        <h1>Make an entry</h1>
        <label htmlFor="body">Body</label>
        <DropzoneWithPreview files={files} setFiles={setFiles} />
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
              <img src={p.photo_url || ""} alt="" height={500} width={500}/>
              <button onClick={() => deletePost({ variables: { post_id: p.post_id } })}>{deleting ? "Deleting" : "Delete"}</button>
            </div>
          )
        })}
      </div>
    </section>
  );
};


function DropzoneWithPreview({setFiles, files}) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbsContainer = {
    display: "flex",
    marginTop: 16,
  };

  const thumb = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  const dropzoneStyles = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: " #eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const thumbs = files.map((file) => (
    <div style={{ ...thumb }} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: File) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })} style={dropzoneStyles}>
        <input {...getInputProps()} name="image" accept="image/*" />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}



export default Home;
