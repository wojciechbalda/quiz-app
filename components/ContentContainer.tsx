import { cn } from "@/lib/utils"
import { HTMLAttributes, ReactNode } from "react"

export function ContentContainer({children, className, ...props}: HTMLAttributes<HTMLDivElement>)
{
    return <div className={cn("max-w-5xl px-5 mx-auto flex flex-col gap-5 items-start", className)} {...props}>
        {children}
    </div>
}