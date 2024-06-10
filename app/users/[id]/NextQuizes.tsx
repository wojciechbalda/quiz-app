'use client'

import QuizCard from "@/components/QuizCard"
import { UserQuizesContext } from "@/context/users"
import { useContext } from "react"

type NextQuizesProps = {
  isSignedIn: boolean
}

export default function NextQuizes({isSignedIn}: NextQuizesProps)
{

    const quizes = useContext(UserQuizesContext)

    return <>
     {quizes.map(
            ({ description, id, _count: {likes: likesCount}, title, thumbnail, likes }) => (
              <QuizCard
                image={thumbnail}
                key={id}
                id={id}
                likes={likesCount}
                title={title}
                description={description}
                isLikedByVisitor={likes && !!likes.length}
                isSignedIn={isSignedIn}
                isRemoveButtonVisible={true}
              />
            )
          )}
    </>
}