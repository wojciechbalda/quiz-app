import { ReactNode } from "react"

type ExtraInformationProps = {
    children: ReactNode
}

export default function ExtraInformation({children}: ExtraInformationProps)
{
    return <p className="text-zinc-500 self-center text-center">{children}</p>
}