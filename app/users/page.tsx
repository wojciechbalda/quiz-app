import { ContentContainer } from "@/components/ContentContainer";
import H1 from "@/components/H1";
import Main from "@/components/Main";
import Pagination from "@/components/Pagination";
import SortingOptionSelect from "@/components/SortingOptionSelect";
import UserCard from "@/components/UserCard";
import { userSortingOptions } from "@/config";
import { getAmountOfUsers, getUsers } from "@/data";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string, sort?: string };
}) {
  const { page, sort = "" } = searchParams;

  const pageValue = Number(page) || 1;
  const usersData = getUsers({page: pageValue, sortKey: sort });
  const numberOfUsersData = getAmountOfUsers()

  const [users, numberOfUsers] = await Promise.all([usersData, numberOfUsersData])

  return (
    <Main>
      <ContentContainer>
        <H1>Users</H1>
        <Suspense>
          <SortingOptionSelect options={userSortingOptions} />
        </Suspense>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-5">
          {users.map(({color, _count: {following: followingNumber, quizes}, id, image, name, following}, index) =>
            <UserCard isUserFollowing={following && following?.length !== 0} id={id} followers={followingNumber} quizes={quizes} nickname={name!} color={color} key={index} image={image} position={index + 1 + (pageValue - 1) * 50} />
          )}
        </div>
        <Suspense>
          <Pagination totalPages={Math.ceil(numberOfUsers/12)} />
        </Suspense>
      </ContentContainer>
    </Main>
  );
}




