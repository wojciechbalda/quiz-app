import { ReactNode } from "react"

type H1Props = {
    children: ReactNode
}

export default function H1({children}: H1Props)
{
    return <h1 className="font-bold text-5xl text-center w-full text-balance uppercase">{children}</h1>
}