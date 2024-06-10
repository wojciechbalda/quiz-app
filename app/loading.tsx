import { ContentContainer } from "@/components/ContentContainer";
import Main from "@/components/Main";

export default function Loading()
{
    return <Main>
        <ContentContainer className="items-center py-5">
            <p className="text-center text-5xl font-bold animate-pulse">Loading...</p>
    </ContentContainer>
    </Main>
}