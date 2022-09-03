import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';
import ReactMarkdown from "react-markdown";
import { H1 } from './H1';
import { H2 } from './H2';

type Props = {
    body: string
}

export const Markdown = ({ body }: Props) => {
    return (
        <ReactMarkdown
            className="my-2 whitespace-pre-wrap"
            components={{
                h1: ({ node, className, ...props }) => <H1 {...props} />,
                h2: ({ node, className, ...props }) => <H2 {...props} />,
                a: ({ node, ...props }) => <a className='text-blue-600 hover:underline text-lg' {...props} />,
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
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}
        >{body}</ReactMarkdown>
    )
}