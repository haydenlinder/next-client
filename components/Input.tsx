
import React, { HTMLInputTypeAttribute } from "react"

type Props = React.ComponentProps<"input">

const Input = React.forwardRef<HTMLInputElement, Props>(({ children, ...props }, ref) => {
    return (
        <input ref={ref} {...props} className={'py-2 px-4 rounded w-full border border-black outline-1' + " " + props.className}/>
    )
})

Input.displayName = 'Input'

export { Input }
