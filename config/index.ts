import { SortingSelectOptions } from "@/types";
import { ZodType, z } from "zod";

export const COLORS = [
  "bg-rose-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-neutral-500",
  "bg-fuchsia-500",
] as const;

export const COLORS_IN_DB = ["RED", "BLUE", "GREEN", "GREY", "VIOLET"];

export type Colors = (typeof COLORS)[number];

export type Settings = { color: Colors; nickname: string };

export const SettingsSchema: ZodType<Settings> = z.object({
  color: z.union([
    z.literal("bg-rose-500"),
    z.literal("bg-sky-500"),
    z.literal("bg-emerald-500"),
    z.literal("bg-neutral-500"),
    z.literal("bg-fuchsia-500"),
  ]),
  nickname: z.string().min(1),
});


export const quizSortingOptions: SortingSelectOptions = [
  { label: "Date", value: "createdAt" },
  { label: "Likes", value: "likes" },
];

export const userSortingOptions: SortingSelectOptions = [
  { label: "Date", value: "createdAt" },
  { label: "Likes", value: "likes" },
  { label: "Number of quizes", value: "quizes" },
  { label: "Followers", value: "following" },
];
