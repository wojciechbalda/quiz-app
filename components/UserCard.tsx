
import {
  Crown,
  FilePlus,
  User,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { cn } from "@/lib/utils";
import { useState } from "react";

type UserProps = {
  position: number;
  id: string;
  followers: number;
  quizes: number;
  color: string;
  nickname: string;
  image: string | null;
  isUserFollowing: boolean
};

export default function UserCard({
  position,
  color,
  followers,
  quizes,
  nickname,
  id,
  image,
  isUserFollowing
}: UserProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="items-center relative w-full">
        <div
          className={cn(
            "absolute top-0 bottom-1/2 inset-x-0 z-10",
            color
          )}
        />
        <Link href={`users/${id}`} className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-sky-500 relative z-20 border flex items-center justify-center overflow-hidden">
            <User size={70} />
            {image && (
              <img
                src={image}
                alt={`${nickname} - profile picture`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="font-bold text-lg underline">{nickname}</p>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col text-center">
        <p className="flex gap-3">
          <Crown />
          Position: {position}
        </p>
        <p className="flex gap-3">
          <UserCheck />
          Followers: {followers}
        </p>
        <p className="flex gap-3">
          <FilePlus />
          Created quizes: {quizes}
        </p>
      </CardContent>
      <CardFooter className="justify-center w-full">
        <FollowButton isUserFollowing={isUserFollowing} userId={id} />
      </CardFooter>
    </Card>
  );
}
