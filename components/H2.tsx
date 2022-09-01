type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>

export const H2 = ({ children, ...props }: Props) => {

    return (
        <h1 {...props} className={'font-bold text-2xl md:text-3xl'  + " " + props.className}>{children}</h1>
    )
}
