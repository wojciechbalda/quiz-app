
import { auth } from "@/auth";
import { prisma } from "@/db/client";

export const getCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

export const QUIZ_PER_PAGE = 12;

export const getQuizes = async ({
  page = 1,
  sortKey = "createdAt",
  category,
  search,
}: {
  page?: number;
  sortKey?: string;
  category?: string;
  search?: string;
}) => {
  const session = await auth();
  const userId = session?.user?.id

  const quizes = await prisma.quiz.findMany({
    take: QUIZ_PER_PAGE,
    skip: (page - 1) * QUIZ_PER_PAGE,
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
      ...(userId && {
        likes: {
          where: {
            userId: userId,
          },
        },
      }),
    },
    ...(search && { where: { title: { contains: `%${search}%`, mode: 'insensitive' } } }),
    ...(category && { where: { categoryName: category } }),
    ...(sortKey && sortKey !== "likes" && { orderBy: { [sortKey]: "desc" } }),
    ...(sortKey === "likes"  && { orderBy: { "likes": {_count: "desc"} } }),
  });

  return quizes;
};



export const getAmountOfQuizes = async ({ category, userId, search }: {category?: string, userId?: string, search?: string}) => {
  const count = await prisma.quiz.count({
    ...(category && { where: { categoryName: category } }),
    ...(userId && {where: {userId}}),
    ...(search && { where: { title: { contains: `%${search}%`, mode: 'insensitive' } } }),
  });

  return count;
};

export const getQuiz = async (id: number) => {
  const data = await prisma.quiz.findUnique({
    where: {
      id,
    },
    include: {
      content: {
        select: {
          id: true,
          answers: true,
          points: true,
          question: true,
        },
      },
    },
  });
  return data;
};

export const getUsers = async ({
  page = 1,
  sortKey,
}: {
  page: number;
  sortKey: string;
}) => {
  const session = await auth();
  const userId = session?.user?.id

  const USERS_PER_PAGE = 12
  try {
    const data = await prisma.user.findMany({
      select: {
        _count: {
          select: {
            quizes: true,
            following: true,
          },
        },
        id: true,
        color: true,
        name: true,
        image: true,
        ...(userId && {following: {
          where: {
            followedById: userId
          }
        }})
      },
      ...(sortKey && sortKey === "createdAt" && { orderBy: { [sortKey]: "desc" } }),
      ...(sortKey && sortKey !== "createdAt" && { orderBy: { [sortKey]: {_count: "desc"} } }),
      take: USERS_PER_PAGE,
      skip: (page-1) * USERS_PER_PAGE
    });
    return data
  } catch (err) {
    throw new Error(`${err}`)
  }
};


export const getUser = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  try {
    const result = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        _count: {
          select: {
            followedBy: true,
            following: true,
            quizes: true,
          },
        },
        ...(userId && {following: {
          where: {
            followedById: userId
        }}}),
        color: true,
        name: true,
      },
    });
    return result;
  } catch (err) {
    throw new Error("Something went wrong")
  }
};

export const getAmountOfUsers = async () =>
{
  try {
    const result = await prisma.user.count()
    return result
  }
  catch (err)
  {
    throw new Error("Something went wrong")
  }
}
