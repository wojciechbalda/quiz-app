"use client";

import { cn, generatePagination } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const paginationArr = generatePagination(currentPage, totalPages);
  const pathname = usePathname();

  function generateLink(page: string | number) {
    const params = new URLSearchParams(searchParams);
    if (page === 1)
        params.delete("page")
    else
        params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages === 0)
    return null

  return (
    <div className="flex gap-1 self-center">
        <PaginationArrow direction="left" href={generateLink(currentPage - 1)} isClickable={currentPage > 1} />
      {paginationArr.map((el, index) => (
          <PaginationItem
          key={index}
          href={generateLink(el)}
          value={el}
          isClickable={el !== "..."}
          isActive={el === currentPage}
          />
        ))}
        <PaginationArrow direction="right" href={generateLink(currentPage + 1)} isClickable={currentPage < totalPages} />
    </div>
  );
}

type PaginationItemProps = {
  value: number | "...";
  isActive: boolean;
  isClickable: boolean;
  href: string;
};

function PaginationItem({ value, isActive, isClickable, href }: PaginationItemProps) {
  const className = cn("w-8 h-8 text-sm flex items-center justify-center", {
    "bg-foreground/10": isActive,
    "hover:bg-foreground/10": !isActive && isClickable,
  });
  if (value === "..." || isActive) {
    return <div className={className}>{value}</div>;
  }
  return (
    <Link className={className} href={href}>
      {value}
    </Link>
  );
}

type PaginationArrowProps = {
  isClickable: boolean;
  href: string;
  direction: "left" | "right";
};

function PaginationArrow({
  direction,
  href,
  isClickable,
}: PaginationArrowProps) {
  const className = cn("w-8 h-8 text-sm flex items-center justify-center", {
    "hover:bg-foreground/10": isClickable,
  });

  const icon = direction === "left" ? <ChevronLeft /> : <ChevronRight />;

  if (isClickable)
    return (
      <Link href={href} className={className}>
        {icon}
      </Link>
    );
  return <div className={className}>{icon}</div>;
}
