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
    console.log({ token })
    const { data } = await serverClient.query<GetPostsQuery>({
        query: GET_POSTS,
        context: { headers: { authorization: `Bearer ${token}` } }
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
            console.error({ e })
        }
    }

    return (
        <section>
            <form className="mb-8" onSubmit={handleSubmit}>
                <h1>Make an entry</h1>
                <label htmlFor="body">Body</label>
                <DropzoneWithPreview files={files} setFiles={setFiles} />
                <textarea placeholder="body" className="border border-black rounded w-full" onChange={e => setBody(e.target.value)} value={body} name="body" id="body" cols={30} rows={10} />
                <button>{saving ? "Saving" : "Post"}</button>
            </form>
            <div>
                <h1>Past posts</h1>
                {posts?.map(post => <Post key={post.id} post={post} />)}
            </div>
        </section>
    );
};


type DropzoneProps = {
    setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>;
    files: FilePreview[];
}

function DropzoneWithPreview({ setFiles, files }: DropzoneProps) {
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
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <section className="container">
            <div {...getRootProps({ className: "dropzone" })} style={dropzoneStyles}>
                <input {...getInputProps()} name="image" accept="image/*" />
                <p>Drag and drop some files here, or click to select files</p>
            </div>
            <aside style={thumbsContainer}>{thumbs}</aside>
        </section>
    );
}

export default Home;
