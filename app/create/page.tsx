import { auth } from "@/auth";
import { ContentContainer } from "@/components/ContentContainer";
import ExtraInformation from "@/components/ExtraInformation";
import H1 from "@/components/H1";
import Main from "@/components/Main";
import QuizForm from "@/components/QuizForm";
import { getCategories } from "@/data";
import { redirect } from "next/navigation";

export default async function Page()
{
    const session = await auth()
    if (!session?.user)
        redirect('/')

    const categories = await getCategories();
    return <Main>
        <ContentContainer>
            <H1>New quiz</H1>
            <ExtraInformation>Fill the form and click submit to create a quiz. Remeber that field called Time express time in seconds!</ExtraInformation>
            <div className="w-full">
              <QuizForm categories={categories} /> 
            </div>
        </ContentContainer>
    </Main>
}
