type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>

export const H1 = ({ children, ...props }: Props) => {

    return (
        <h1 {...props} className={props.className + ' ' + 'font-bold text-2xl'}>{children}</h1>
    )
}
