import React from "react"

type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>

export const Button = React.forwardRef<HTMLButtonElement, Props>(({ children, ...props }, ref) => {
    return (
        <button ref={ref} {...props} className={'font-bold p-2 border border-black rounded' + " " + props.className}>{children}</button>
    )
})
