import { useMutation } from "@apollo/client";
import { NextPage } from "next";
import { ComponentProps, CSSProperties, FormEventHandler, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CREATE_POST, GET_POSTS, UPDATE_POST } from "../graphql/posts";
import { FileResponse } from "../pages/api/images/upload";
import { SessionData } from "../pages/api/session/types";
import { User } from "../types/entities";
import { CreatePostMutation, CreatePostMutationVariables, UpdatePostMutation, UpdatePostMutationVariables } from "../types/generated/graphql";
import { Button } from "./Button";
import { H1 } from "./H1";
import { Input } from "./Input";

import { Markdown } from "./Markdown";
import { Post } from "./Post";
import { PostPreview } from "./PostPreview";

type Props = {
    session: SessionData
    onAfterSave?: () => void
    originalBody?: string;
    originalTitle?: string;
    originalDescription?: string;
    originalPhoto?: string | null;
    originalPrice?: number;
    postId?: number;
}

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

const PostForm: NextPage<Props> = ({ 
    session, 
    originalBody,
    originalDescription,
    originalTitle,
    originalPhoto,
    originalPrice,
    postId,
    onAfterSave = () => null 
}) => {

    const isEdit = Boolean(postId);

    const [body, setBody] = useState(originalBody || "");
    const [description, setDescription] = useState(originalDescription || "");
    const [title, setTitle] = useState(originalTitle || "");
    const [price, setPrice] = useState(originalPrice || "");
    const [files, setFiles] = useState<FilePreview[]>([]);

    const [savePost, { loading: saving }] = useMutation<CreatePostMutation, CreatePostMutationVariables>(CREATE_POST, {
        refetchQueries: [
            GET_POSTS
        ]
    });

    const [updatePost, { loading: updating }] = useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UPDATE_POST, {
        refetchQueries: [
            GET_POSTS
        ]
    });

    const save = async () => {
        try {
            const imageKeys = await Promise.all(files.map(uploadImage));
            await savePost({
                variables: {
                    body,
                    description,
                    title,
                    price,
                    user_id: session?.user_id,
                    photo_url: imageKeys[0],
                }
            });
        } catch (e) {
            console.error({ e })
        }
    }
    
    const update = async () => {
        try {
            const imageKeys = await Promise.all(files.map(uploadImage));
            await updatePost({
                variables: {
                    post_id: postId,
                    body,
                    description,
                    title,
                    photo_url: imageKeys[0] || originalPhoto,
                }
            });
        } catch (e) {
            console.error({ e })
        }
    }

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        await (isEdit ? update() : save());
        onAfterSave()
    }

    const post = {
        photo_url:  files[0]?.preview || originalPhoto,
        title,
        description,
        price,
        created_at: Date.now(),
        id: "1eserkjh4.mnasdfw==",
        body,
        post_id: 1
    }

    return (
        <div className="">
            <form className="mb-10" onSubmit={handleSubmit}>
                <H1>Make an entry</H1>
                {/* title */}
                <label htmlFor="title">Title</label>
                <input placeholder="title" className="p-2 border border-black rounded w-full" onChange={e => setTitle(e.target.value)} value={title} name="title" id="title" />
                {/* description */}
                <label htmlFor="description">Description</label>
                <textarea placeholder="description" className="p-2 border border-black rounded w-full" onChange={e => setDescription(e.target.value)} value={description} name="description" id="description" cols={30} rows={5} />
                <label htmlFor="price">Price</label>
                <Input placeholder="price" onChange={e => setPrice(e.target.value)} value={price} name="price" id="price" />
                {/* body */}
                <label htmlFor="body">Body</label>
                <textarea placeholder="body" className="p-2 mb-4 border border-black rounded w-full" onChange={e => setBody(e.target.value)} value={body} name="body" id="body" cols={30} rows={10} />
                {/* photos */}
                <DropzoneWithPreview files={files} setFiles={setFiles} />
                <Button className="my-6">{saving ? "Saving" : "Post"}</Button>
                <br />
                <PostPreview preview={files.length > 0} post={post} />
                <br />
                <Post 
                    preview={files.length > 0}
                    post={post}
                />
            </form>
            {/* preview */}
        </div>
    )
}

type DropzoneProps = {
    setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>;
    files: FilePreview[];
}

export interface FilePreview extends File {
    preview: string;
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
        cursor: "pointer"
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


export default PostForm;