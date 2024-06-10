import H1 from "@/components/H1";
import Quiz from "./Quiz";
import { getQuiz } from "@/data";
import { notFound } from "next/navigation";
import Main from "@/components/Main";

export default async function Page({params}: {params: {quiz: string}})
{
    const quizData = await getQuiz(Number(params.quiz))

    if (!quizData)
        notFound()

    const {categoryName, content, description, time, title, userId} = quizData

    return <Main>
        <Quiz 
        categoryName={categoryName}
        content={content}
        description={description}
        time={time}
        title={title}
        user={userId}
        />
    </Main>
}