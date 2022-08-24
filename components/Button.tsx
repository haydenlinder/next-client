type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>

export const Button = ({ children, ...props }: Props) => {
    return (
        <button {...props} className={'font-bold p-2 border border-black rounded' + " " + props.className}>{children}</button>
    )
}
