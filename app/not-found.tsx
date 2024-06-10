import { ContentContainer } from "@/components/ContentContainer";
import H1 from "@/components/H1";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page()
{
    return <main className="py-5">
        <ContentContainer className="items-center">
            <H1>Page was not found</H1>
            <Link className={buttonVariants()} href="/">Go to the main page</Link>
        </ContentContainer>
    </main>   
}