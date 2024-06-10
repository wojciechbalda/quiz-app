"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeUserSettings } from "@/data/actions";
import { COLORS, Colors, Settings, SettingsSchema } from "@/config";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";
import { title } from "process";

type SettingsDialogProps = {
  color: Colors;
  nickname: string;
};

export default function SettingsDialog({
  color,
  nickname,
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<Settings>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      color,
      nickname,
    },
  });

  const colorValue = watch("color");
  const {toast} = useToast()

  const onSubmit: SubmitHandler<Settings> = async (data) => {
    const res = await changeUserSettings(data);
    if (!res.error)
    {
      setOpen(false)
    }

    toast({
      description: res.message,
      variant: res.error ? 'destructive' : 'default'
    })
  };

  /* 
bg-rose-500 
bg-sky-500
bg-emerald-500 
bg-neutral-500
bg-fuchsia-500
*/

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <SettingsIcon /> Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your color</DialogTitle>
          <DialogDescription>
            This color will be shown as a background in users section within
            your profile card.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 gap-5">
            {COLORS.map((color) => (
              <div
                onClick={() => setValue("color", color)}
                key={color}
                className={cn("w-full aspect-square cursor-pointer", color, {
                  "border-4": colorValue === color,
                })}
              ></div>
            ))}
          </div>
          <Input className="hidden" {...register("color")} />
          <div className="grid gap-2">
            <Label>Your nickname</Label>
            <Input {...register("nickname")} />
            {errors.nickname && (
              <p className="text-red-500">{errors.nickname.message}</p>
            )}
          </div>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
