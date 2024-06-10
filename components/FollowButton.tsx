"use client";

import { User } from "lucide-react";
import { Button } from "./ui/button";
import { follow, unfollow } from "@/data/actions";
import { useToast } from "./ui/use-toast";

type FollowButtonProps = {
  userId: string;
  isUserFollowing: boolean;
};

export default function FollowButton({ userId, isUserFollowing }: FollowButtonProps) {
  const { toast } = useToast();

  return (
    <Button
      onClick={async () => {
        let res: {
          error: boolean;
          message: string;
        };
        if (isUserFollowing) {
          res = await unfollow(userId)
        } else {
          res = await follow(userId);
        }
        toast({
          description: res.message,
          variant: res.error ? "destructive" : "default",
        });
      }}
      className="gap-2"
    >
      <User />
      {isUserFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
