import {z, ZodType} from 'zod'

type QuestionAndAnswers = {
    question: string,
    correctAnswer: string,
    answers: string[]
    points: string
}

export type Quiz = {
    title: string,
    description: string,
    imageUrl: string,
    time: string,
    category: string,
    content: QuestionAndAnswers[]
}

type ModfifedQuestionAndAnswers = Omit<QuestionAndAnswers, 'correctAnswer' | 'points'> & {correctAnswer: number, points: number}
export type QuizSchemaType = Omit<Quiz, 'time' | 'content'> & {time: number} & {content: ModfifedQuestionAndAnswers[]}

export const QuizSchema: ZodType<QuizSchemaType> = z.object({
    title: z.string().min(5),
    description: z.string().min(5).max(60),
    imageUrl: z.string().startsWith('https://pixabay.com/get/'),
    time: z.coerce.number().positive().lte(600),
    category: z.string().min(1),
    content: z.array(z.object({
        question: z.string().min(5).endsWith('?'),
        correctAnswer: z.coerce.number().min(1).max(4),
        answers: z.array(z.string().min(1)).length(4),
        points: z.coerce.number().min(1).max(10)
    })).min(1).max(20)
})

export type SortingSelectOptions = {
    label: string,
    value: string,
}[]