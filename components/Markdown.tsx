import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';
// import ReactMarkdown from "react-markdown";
import { H1 } from './H1';
import { H2 } from './H2';
import dynamic from 'next/dynamic';


type Props = {
    body: string
}
//@ts-ignore-error
const ReactMarkdown = dynamic(async () => (await import('react-markdown')).default, {
    ssr: false,
    loading: () => <>Loading...</>,
});

export const Markdown = ({ body }: Props) => {
    return (
        <ReactMarkdown
            className="my-2 whitespace-pre-wrap"
            components={{
                h1: ({ node, className, ...props }) => {
                    const id = typeof props.children?.[0] === 'string' ? props.children?.[0]?.split(" ").join('-') : ''
                    return (
                        <a className='hover:underline relative' href={'#'+id}>
                            <div id={id} className='absolute top-[-100px]'></div>
                            <H1 {...props} />
                        </a>
                    )
                },
                h2: ({ node, className, ...props }) => {
                    const id = typeof props.children?.[0] === 'string' ? props.children?.[0]?.split(" ").join('-') : ''
                    return (
                        <a className='hover:underline relative' href={'#' + id}>
                            <div id={id} className='absolute top-[-100px]'></div>
                            <H2 {...props} />
                        </a>
                    )
                },
                a: ({ node, ...props }) => <a className='text-blue-600 hover:underline' {...props} />,
                code: ({ node, inline, className, children, ...props }) => {
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
                        <code className='bg-yellow-800 text-yellow-200 px-1.5 py-0.5 rounded' {...props}>
                            {children}
                        </code>
                    )
                }
            }}
        >{body}</ReactMarkdown>
    )
}