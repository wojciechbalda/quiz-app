import { headers } from "next/headers";

export async function GET(request: Request)
{
    const {searchParams} = new URL(request.url)
    const query = searchParams.get('query');
    const res = await fetch(`https://pixabay.com/api/?key=23571599-4d00e6e684d1e8a25bf696f49&q=${query || ""}&per_page=18&image_type=photo`, {cache: "no-store"});
    const data: {hits: {largeImageURL: string}[]} = await res.json();
    const formattedData = data.hits.map(el => el.largeImageURL);

    return Response.json({images: formattedData});
} 