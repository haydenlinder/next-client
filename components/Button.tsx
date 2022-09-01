import React from "react"

type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>> & {
    secondary?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, Props>(({ children, secondary, ...props }, ref) => {
    const primaryStyles = "from-blue-700 hover:from-purple-700 focus:from-violet-700 via-blue-600 to-blue-500"
    const secondaryStyles = "from-orange-700 hover:from-red-600 focus:from-red-600 via-orange-600 to-orange-500"
    return (
        <button ref={ref} {...props} className={'font-bold py-2 px-4 text-white drop-shadow-md hover:drop-shadow-lg rounded bg-gradient-to-r ' + (secondary ? secondaryStyles : primaryStyles) + " " + props.className}>{children}</button>
    )
})

Button.displayName = 'Button'

export {Button}
