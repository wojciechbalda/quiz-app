'use client'

import { Button } from "@/components/ui/button";
import { getUserQuizes } from "@/data/actions";
import { createContext, useState } from "react";

export const UserQuizesContext = createContext<Awaited<ReturnType<typeof getUserQuizes>>>([])

type UsersContextProviderProps = {
    children: React.ReactNode,
    id: string,
    userQuizesCount: number,
}

export default function UserQuizesContextProvider({children, id, userQuizesCount}: UsersContextProviderProps)
{
    const [page, setPage] = useState(2)
    const isNextPage = page < Math.ceil(userQuizesCount / 9) 
    const [quizes, setQuizes] = useState<Awaited<ReturnType<typeof getUserQuizes>>>([])
  
    const handleLoadMoreQuizes = async () => {
        const data = await getUserQuizes(id, page)
        setPage(curPage => curPage + 1)
        setQuizes((q) => [...q, ...data])
    }

    return <UserQuizesContext.Provider value={quizes}>
        {children}
        {isNextPage && <Button onClick={handleLoadMoreQuizes}>Load more</Button>}
    </UserQuizesContext.Provider>
}