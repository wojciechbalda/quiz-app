import { ContentContainer } from "@/components/ContentContainer";
import H1 from "@/components/H1";
import QuizCard from "@/components/QuizCard";
import SettingsDialog from "@/components/SettingsDialog";
import { Separator } from "@/components/ui/separator";
import { getAmountOfQuizes, getUser } from "@/data";
import { notFound } from "next/navigation";
import NextQuizes from "./NextQuizes";
import UserQuizesContextProvider from "@/context/users";
import { Colors } from "@/config";
import { auth } from "@/auth";
import FollowButton from "@/components/FollowButton";
import { getUserQuizes } from "@/data/actions";
import Main from "@/components/Main";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await auth()
  const userId = session?.user?.id

  const user = getUser(id);
  const userQuizesData = getUserQuizes(id, 1);
  const count = getAmountOfQuizes({userId: id})

  const [userData, userQuizes, countData] = await Promise.all([user, userQuizesData, count]);

  if (!userData) notFound();

  const {name, _count: {followedBy, following: followingCount, quizes}, color, following} = userData;

  return (
    <Main>
      <ContentContainer className="items-center">
        <H1>{name}</H1>
        <div className="grid grid-cols-3">
          <p>Follows: {followedBy}</p>
          <p>Followed: {followingCount}</p>
          <p>Created quizes: {quizes}</p>
        </div>
        <Separator />
        <div className="flex gap-2">
          {userId !== id && <FollowButton isUserFollowing={following && following?.length !== 0} userId={id} />}
          {userId === id && <SettingsDialog color={color as Colors} nickname={name!} />}
        </div>
        <UserQuizesContextProvider id={id} userQuizesCount={countData} >
          <div className="grid grid-cols-3 gap-5 w-full">
            {userQuizes.map(
            ({ description, id: quizId, _count: {likes: likesCount}, title, thumbnail, likes }) => (
              <QuizCard
                image={thumbnail}
                key={quizId}
                id={quizId}
                likes={likesCount}
                title={title}
                description={description}
                isLikedByVisitor={likes && !!likes.length}
                isSignedIn={userId === id}
                isRemoveButtonVisible={false}
              />
            )
          )}
            <NextQuizes isSignedIn={userId === id} />
          </div>
        </UserQuizesContextProvider>
      </ContentContainer>
    </Main>
  );
}