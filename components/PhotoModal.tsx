"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useDebouncedCallback } from "use-debounce";
import { UseFormSetValue } from "react-hook-form";
import { Quiz } from "@/types";

type PhotoModalProps = {
  onSelectPhoto: UseFormSetValue<Quiz>;
};

export default function PhotoModal({ onSelectPhoto }: PhotoModalProps) {
  const [data, setData] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearch = useDebouncedCallback(async (value: string) => {
    const res = await fetch(`/api/photo?query=${value}`);
    const data = await res.json();
    setData(data.images);
  }, 300);

  return (
    <Dialog
      open={open}
      onOpenChange={(value: boolean) => {
        if (value)
          handleSearch('');
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">Choose image</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="pt-3">
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
          />
        </DialogHeader>
        <div className="grid grid-cols-3 overflow-y-auto h-64 gap-2">
          {data.map((el) => (
            <div
              onClick={() => setSelected(el)}
              className="relative aspect-square bg-blue-400 cursor-pointer"
              key={el}
            >
              <Image
                alt=""
                src={el}
                width={140}
                height={140}
                className={cn("w-full h-full object-cover", {
                  grayscale: selected == el,
                })}
              />
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            onSelectPhoto("imageUrl", selected);
            setOpen(false);
          }}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
