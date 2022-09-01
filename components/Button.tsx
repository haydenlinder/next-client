import React from "react"

type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>

const Button = React.forwardRef<HTMLButtonElement, Props>(({ children, ...props }, ref) => {
    return (
        <button ref={ref} {...props} className={'font-bold p-2 text-white drop-shadow-md hover:drop-shadow-lg rounded bg-gradient-to-r from-blue-700 hover:from-purple-700  focus:from-violet-700 via-blue-600 to-blue-500' + " " + props.className}>{children}</button>
    )
})

Button.displayName = 'Button'

export {Button}
