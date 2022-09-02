import { useMutation } from "@apollo/client";
import { NextPage } from "next";
import { ComponentProps, CSSProperties, FormEventHandler, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { CREATE_POST, GET_POSTS, UPDATE_POST } from "../graphql/posts";
import { FileResponse } from "../pages/api/images/upload";
import { User } from "../types/entities";
import { CreatePostMutation, CreatePostMutationVariables, UpdatePostMutation, UpdatePostMutationVariables } from "../types/generated/graphql";
import { Button } from "./Button";
import { H1 } from "./H1";
import { H2 } from "./H2";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus  from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';

type Props = {
    user: User
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
    user, 
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
                    user_id: user?.user_id,
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

    return (
        <form className="mb-8" onSubmit={handleSubmit}>
            <H1>Make an entry</H1>
            {/* title */}
            <label htmlFor="title">Title</label>
            <input placeholder="title" className="p-2 border border-black rounded w-full" onChange={e => setTitle(e.target.value)} value={title} name="title" id="title" />
            {/* description */}
            <label htmlFor="description">Description</label>
            <textarea placeholder="description" className="p-2 border border-black rounded w-full" onChange={e => setDescription(e.target.value)} value={description} name="description" id="description" cols={30} rows={5} />
            {/* body */}
            <label htmlFor="body">Body</label>
            <textarea placeholder="body" className="p-2 border border-black rounded w-full" onChange={e => setBody(e.target.value)} value={body} name="body" id="body" cols={30} rows={10} />
            {/* photos */}
            <DropzoneWithPreview files={files} setFiles={setFiles} />
            {/* preview */}
            {body &&
                <>
                    <H1 className="my-2">Preview:</H1>
                    <H1 className="my-2">{title}</H1>
                    <p>{description}</p>
                    <ReactMarkdown 
                        className="p-2 my-2 rounded border border-black" 
                        components={{
                            // pre: ({ children, node, ...props }) => <pre className="bg-black text-white rounded p-4" {...props}>{children}</pre>,
                            br: ({node, ...props}) => <br {...props}/>,
                            h1: ({ node, ...props }) => <H1 {...props} />,
                            h2: ({ node, ...props }) => <H2 {...props} />,
                            a: ({ node, ...props }) => <a className='text-blue-600 hover:underline text-lg' {...props} />,
                            code: ({node, inline, className, children, ...props}) =>{
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                <SyntaxHighlighter
                                    // @ts-ignore-error - no idea why TS doesn't allow this, even with type assertion
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                    >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                                ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                                )
                            }
                        }}
                    >{body}</ReactMarkdown>
                    <Button className="">{saving ? "Saving" : "Post"}</Button>
                </>}
        </form>
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