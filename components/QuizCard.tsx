"use client";

import { Heart, Trash } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { likeQuiz, unlikeQuiz } from "@/data/actions";

type QuizCardProps = {
  likes: number;
  title: string;
  description: string;
  image: string;
  id: number;
  isLikedByVisitor: boolean;
  isSignedIn: boolean;
  isRemoveButtonVisible?: boolean
};

export default function QuizCard({
  likes,
  title,
  description,
  id,
  image,
  isLikedByVisitor,
  isSignedIn,
  isRemoveButtonVisible
}: QuizCardProps) {
  const [isLiked, setIsLiked] = useState(isLikedByVisitor);
  const [likesNumber, setLikesNumber] = useState(likes);

  const handleLike = async () => {
    let res;
    if (isLiked) {
      res = await unlikeQuiz(id);
    } else {
      res = await likeQuiz(id);
    }

    if (res) {
      setIsLiked(res.value == 1);
      setLikesNumber((value) => value + res.value!);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="aspect-[4/3]">
        <div className="w-full relative h-full">
          <Image
            className="w-full h-full object-cover"
            src={image}
            alt=""
            fill
          />
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <h2 className="font-bold">{title}</h2>
        <p className="line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-col justify-end gap-2 grow">
        {isSignedIn &&
          <Button variant="ghost" onClick={handleLike} className="h-auto">
            <div>
              <Heart fill={isLiked ? `red` : `black`} />
              <p>{likesNumber}</p>
            </div>
          </Button>
        }
        {!isSignedIn &&
            <div className="flex flex-col items-center">
              <Heart fill="black" />
              <p>{likesNumber}</p>
            </div>
        }
        <div className="flex gap-2">
          <Link href={`/${id}`} className={buttonVariants()}>
            Przejdź dalej
          </Link>
          {isRemoveButtonVisible && isSignedIn && 
          <form>
            <Button className="flex gap-2" variant="outline">
              Remove
              <Trash size={16} />
            </Button>
          </form>
          }
        </div>
      </CardFooter>
    </Card>
  );
}
