'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "./ui/input"
import { ChangeEvent, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"


export default function Search()
{
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const {replace} = useRouter()
    const [value, setValue] = useState(pathname == "/search" ? searchParams.get('query') || "" : "")

    useEffect(() => {
        setValue(prevValue => {
            return pathname !== "/search" ? '' : prevValue
        })
        
    }, [pathname])

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams()
        params.set('query', value)  
        replace(`/search?${params.toString()}`)
    }, 400)

    return <Input onChange={(e) => {setValue(e.target.value); handleSearch(e.target.value)}} placeholder="Search..." value={value} />
}