"use server";

import { Settings, SettingsSchema } from "@/config";
import { prisma } from "@/db/client";
import { QuizSchema, QuizSchemaType } from "@/types";
import { z } from "zod";
import { QUIZ_PER_PAGE } from ".";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createQuiz(data: QuizSchemaType) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId)
    return { error: true, message: "You must be signed in to create a quiz" };

  const parsedData = QuizSchema.safeParse(data);

  if (!parsedData.success)
    return { error: true, message: "Data are not correct" };


  const {
    data: { description, imageUrl: thumbnail, content, time, title, category },
  } = parsedData;

  try {
    const res = await prisma.quiz.create({
      data: {
        description,
        thumbnail,
        time,
        title,
        categoryName: category,
        userId: userId,
        content: {
          create: content,
        },
      },
    });
    revalidatePath('/', 'layout')
    return { error: false, message: `Quiz (${res.id}) has been created` };
  } catch (err) {
    return { error: true, message: "Something went wrong" };
  }
}

export async function checkAnswers(
  quizId: number,
  data: { id: number; answer: number }[]
) {
  const sData = await prisma.singleQuestionAndAnswers.findMany({
    where: {
       quizId,
    },
    select: {
      id: true,
      correctAnswer: true,
      points: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (data.length !== sData.length)
    return { error: true, message: "Incorrect data" };

  data.sort((a, b) => a.id - b.id);
  
  let points = 0;

  for (let i = 0; i < sData.length; i++) {
    if (data[i].answer === sData[i].correctAnswer) points += sData[i].points;
  }

  return {error: false, message: `${points}`};
}

export async function likeQuiz(id: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: true, message: "You must be logged in" };

  const schema = z.number().positive();

  const validatedData = schema.safeParse(id);

  if (!validatedData.success) return { error: true, message: "Wrong input" };

  try {
    const result = await prisma.likes.findMany({
      where: {
        userId,
        quizId: validatedData.data,
      },
    });
    if (result.length > 0) {
      return { message: "You cannot like this quiz again", value: 0 };
    }
    await prisma.likes.create({
      data: {
        quizId: validatedData.data,
        userId,
      },
    });
    revalidatePath('/', 'layout')
    return { message: "You liked the quiz successfully", value: 1 };
  } catch (err) {
    return { error: true, message: "Something went wrong" };
  }
}

export async function unlikeQuiz(id: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: true, message: "You must be logged in" };

  const schema = z.number().positive();

  const validatedData = schema.safeParse(id);

  if (!validatedData.success) return { error: true, message: "Wrong input" };

  try {
    await prisma.likes.deleteMany({
      where: {
        quizId: validatedData.data,
        userId,
      },
    });
    revalidatePath('/', 'layout')
    return { message: "Like was removed", value: -1 };
  } catch (err) {
    return { error: true, message: "Something went wrong" };
  }
}

export async function follow(id: string): Promise<{
  error: boolean;
  message: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return { error: true, message: "You must be logged in to follow others" };

  const schema = z.string();

  const data = schema.safeParse(id);

  if (!data.success) return { error: true, message: "Wrong input" };


  if (id === userId)
    return { message: "You cannot follow yourself", error: true };

  try {
    await prisma.follows.create({
      data: {
        followedById: userId,
        followingId: id,
      },
    });
    revalidatePath('/users')
    return {message: `You followed user successfully`, error: false}
  } catch (err) {
    return { message: "Something went wrong", error: true };
  }
}

export async function unfollow(id: string): Promise<{
  error: boolean;
  message: string;
}>
{
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return { error: true, message: "You must be logged in to unfollow others" };

  const schema = z.string();

  const data = schema.safeParse(id);

  if (!data.success) return { error: true, message: "Wrong input" };

  if (id === userId)
    return { message: "You cannot unfollow yourself", error: true };

  try {
    await prisma.follows.deleteMany({
      where: {
        followedById: userId,
        followingId: id,
      }
    });
    revalidatePath('/users')
    return {message: `You unfollowed user successfully`, error: false}
  } catch (err) {
    return { message: "Something went wrong", error: true };
  }
}

export async function changeUserSettings(data: Settings) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: true, message: "You must be logged in" };

  const parsedData = SettingsSchema.safeParse(data);

  if (!parsedData.success) return { error: true, message: "Incorrect data" };

  const { color, nickname } = parsedData.data;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        color,
        name: nickname,
      },
    });
    revalidatePath('/users')
    revalidatePath(`/users/${userId}`)
    return { error: false, message: 'Settings has been changed' };
  } catch (err) {
    return { error: true, message: "Something went wrong" };
  }
}


export const getUserQuizes = async (id: string, page: number) => {
  try {
    const session = await auth();
    const userId = session?.user?.id

    const result = await prisma.quiz.findMany({
      where: {
        userId: id,
      },
      skip: (page - 1) * QUIZ_PER_PAGE,
      take: QUIZ_PER_PAGE,
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        ...(userId && {
          likes: {
            where: {
              userId,
            },
          },
        }),
      },
    });

    return result;
  } catch (err) {
    throw new Error(`Something went wrong  ${err}`)
  }
};

export const deleteQuiz = async (id: number) =>
{
  const session = await auth()
  const userId = session?.user?.id

  if (!userId)
    return {error: true, message: "You have to signed in"}

  const parsedData = z.number().safeParse(id)

  if (!parsedData.success)
    return {error: true, message: "Incorrect data"}

  try
  {
    await prisma.quiz.delete({
      where: {
        id,
        userId, 
      }
    })
    revalidatePath('/', 'layout')
    return { error: false, message: `Quiz (${id}) has been deleted` };
  }
  catch (err)
  {
    return { error: true, message: `Quiz has not been deleted` }
  }
}