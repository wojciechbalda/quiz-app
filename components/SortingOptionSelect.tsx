'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortingOptionSelect({options}: {options: {value: string, label: string}[]})
{
    const pathname = usePathname()
    const { replace } = useRouter()
    const searchParams = useSearchParams()

    const handleChangeSelect = (value: string) => {
        const params = new URLSearchParams(searchParams)
        params.delete('page')
        params.set('sort', value)  
        replace(`${pathname}?${params.toString()}`)
    }
    
    return <Select defaultValue={searchParams.get('sort-by') || ''} onValueChange={handleChangeSelect}>
        <SelectTrigger>
            <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
            {options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
    </Select>
}