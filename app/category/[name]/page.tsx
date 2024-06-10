import { auth } from "@/auth";
import { ContentContainer } from "@/components/ContentContainer";
import H1 from "@/components/H1";
import Main from "@/components/Main";
import Pagination from "@/components/Pagination";
import QuizCard from "@/components/QuizCard";
import SortingOptionSelect from "@/components/SortingOptionSelect";
import { quizSortingOptions } from "@/config";
import { getAmountOfQuizes, getQuizes } from "@/data";
import { Suspense } from "react";

export default async function Page({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { sort?: string; page?: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const { sort = "", page = "1" } = searchParams;
  const { name: category } = params;

  const quizData = getQuizes({ page: Number(page), category });
  const countData = getAmountOfQuizes({category});

  const [data, count] = await Promise.all([quizData, countData]);

  return (
    <Main>
      <ContentContainer>
        <H1>{category.charAt(0).toUpperCase() + category.slice(1)}</H1>
        <Suspense>
          <SortingOptionSelect options={quizSortingOptions} />
        </Suspense>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 self-stretch">
        {data.map(
            ({ description, id, _count: {likes: likesCount}, title, thumbnail, likes }) => (
              <QuizCard
                image={thumbnail}
                key={id}
                id={id}
                likes={likesCount}
                title={title}
                description={description}
                isLikedByVisitor={likes && !!likes.length}
                isSignedIn={!!userId}
              />
            )
          )}
        </div>
        <Suspense>
          <Pagination totalPages={Math.ceil(count/12)} />
        </Suspense>
      </ContentContainer>
    </Main>
  );
}
