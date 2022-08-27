type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>

export const H2 = ({ children, ...props }: Props) => {

    return (
        <h1 {...props} className={props.className + ' ' + 'font-bold text-3xl'}>{children}</h1>
    )
}
