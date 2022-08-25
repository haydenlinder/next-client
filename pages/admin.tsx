import type { GetServerSideProps, NextPage } from "next";
import {
    CreatePostMutation,
    CreatePostMutationVariables,
    GetPostsQuery,
    GetUserByIdQuery,
    GetUserByIdQueryResult,
} from "../types/generated/graphql";
import { useMutation, useReactiveVar } from "@apollo/client";
import { FormEventHandler, useEffect, useState } from "react";
import { CREATE_POST, GET_POSTS } from "../graphql/posts";
import { useDropzone } from "react-dropzone";
import { Post } from "../components/Post";
import { FileResponse } from "./api/images/upload";
import { serverClient } from "./api/apollo-client";
import { getCookieParser } from "next/dist/server/api-utils";
import ReactMarkdown from "react-markdown";
import { getCurrentUser } from "./api/apollo_functions/users";
import { Button } from "../components/Button";
import { H1 } from "../components/H1";


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
    posts: GetPostsQuery['posts_connection']['edges'][0]['node'][];
    user: GetUserByIdQuery['users_connection']['edges'][0]['node'] | undefined
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
    const cookies = getCookieParser(req.headers)()
    const token = cookies.access_token

    const { data } = await serverClient.query<GetPostsQuery>({
        query: GET_POSTS,
        context: { headers: { authorization: `Bearer ${token}` } }
    })

    const user = await getCurrentUser(req);

    return (
        {
            props: {
                posts: data.posts_connection.edges.map(e => e.node),
                user
            }
        }
    )
}

const Home: NextPage<Props> = ({ posts, user }) => {
    const [body, setBody] = useState("");
    const [files, setFiles] = useState<FilePreview[]>([]);

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
                    user_id: user?.user_id,
                    photo_url: imageKeys[0],
                }
            });
        } catch (e) {
            console.error({ e })
        }
    }

    return (
        <section className="container">
            <form className="mb-8" onSubmit={handleSubmit}>
                <H1>Make an entry</H1>
                <label htmlFor="body">Body</label>
                <textarea placeholder="body" className="p-2 border border-black rounded w-full" onChange={e => setBody(e.target.value)} value={body} name="body" id="body" cols={30} rows={10} />
                <DropzoneWithPreview files={files} setFiles={setFiles} />
                {body && 
                <>
                    <H1 className="my-2 font-bold text-lg">Preview:</H1>
                    <ReactMarkdown className="p-2 my-2 rounded border border-black" components={{
                        h1: ({ node, ...props }) => <h1 className='font-bold text-lg' {...props} />,
                        a: ({ node, ...props }) => <a className='text-blue-600 hover:underline text-lg' {...props} />
                    }}>{body}</ReactMarkdown>
                    <Button className="">{saving ? "Saving" : "Post"}</Button>
                </>}
            </form>
            <div>
                <H1>Courses</H1>
                {posts?.map(post => <Post user={user} key={post.id} post={post} />)}
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
