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
  searchParams: { query },
}: {
  searchParams: { query: string | undefined };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const search = query || "";
  const quizesData = getQuizes({ search });
  const countData = getAmountOfQuizes({ search });

  const [data, count] = await Promise.all([quizesData, countData]);

  return (
    <Main>
      <ContentContainer>
        <H1>Search: {query}</H1>
        <Suspense>
          <SortingOptionSelect options={quizSortingOptions} />
        </Suspense>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 w-full">
          {data.map(
            ({
              description,
              id,
              _count: { likes: likesCount },
              title,
              thumbnail,
              likes,
            }) => (
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
          <Pagination totalPages={Math.ceil(count / 12)} />
        </Suspense>
      </ContentContainer>
    </Main>
  );
}
