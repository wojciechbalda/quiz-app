"use client";

import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button, buttonVariants } from "./ui/button";
import { ContentContainer } from "./ContentContainer";
import { ChevronDown, Menu } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "./Search";

type HeaderProps = {
  categories: { name: string }[];
  children: React.ReactNode;
};

export function Header({ categories, children }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsCategoryOpen(false);
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    // overflow-hidden
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleChangeViewportSize = (x: MediaQueryListEvent) => {
      if (x.matches) document.body.classList.remove("overflow-hidden");
      else if (!x.matches && isOpen)
        document.body.classList.add("overflow-hidden");
      else document.body.classList.remove("overflow-hidden");
    };

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    mediaQuery.addEventListener("change", handleChangeViewportSize);

    return () => {
      mediaQuery.removeEventListener("change", handleChangeViewportSize);
    };
  }, [isOpen]);

  return (
    <header className="flex items-center bg-background sticky top-0 z-50">
      <ContentContainer className="flex-row items-baseline justify-between py-2 w-full bg-inherit">
        <Link className="font-bold italic text-xl" href="/">
          QuizApp
        </Link>
        <div
          className={cn(
            "absolute inset-x-0 h-[calc(100vh-40px)] bg-inherit top-full px-5 lg:px-0 z-50 lg:static lg:h-auto lg:flex lg:items-center lg:grow lg:justify-between",
            { hidden: !isOpen }
          )}
        >
          <ul className="lg:flex gap-2 bg-inherit">
            <li className="py-2 lg:py-0">
              <Link href="/users">Users</Link>
            </li>
            <li
              className="py-2 lg:py-0 relative bg-inherit"
              onClick={() => setIsCategoryOpen((isOpen) => !isOpen)}
            >
              <div className="flex gap-2 cursor-pointer bg-inherit">
                Categories{" "}
                <ChevronDown className={cn({ "rotate-180": isCategoryOpen })} />
              </div>
              <div
                className={cn(
                  "flex flex-col lg:absolute lg:top-full bg-inherit lg:min-w-full",
                  { hidden: !isCategoryOpen }
                )}
              >
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/category/${category.name}`}
                    className="px-2 py-1"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
          <div className="flex flex-col lg:flex-row gap-2">
            <Suspense>
              <Search />
            </Suspense>
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "basis-full"
              )}
              href="/create"
            >
              Create a new quiz
            </Link>
            {children}
          </div>
        </div>
        <Button
          size="sm"
          className="lg:hidden"
          onClick={() => {
            setIsOpen((isOpen) => !isOpen);
          }}
        >
          <Menu />
        </Button>
      </ContentContainer>
    </header>
  );
}
