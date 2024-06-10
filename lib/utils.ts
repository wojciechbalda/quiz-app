import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  const placeholder = "..." as const
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage < 4) {
    return [1, 2, 3, 4, placeholder, totalPages - 1, totalPages];
  }

  if (currentPage > totalPages - 3) {
    return [1, 2, placeholder, totalPages-3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    placeholder,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    placeholder,
    totalPages,
  ];
};

