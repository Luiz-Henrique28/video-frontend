import { http } from "../../../core/services/http";

type CardPostModel = {
    id: number,
    // Deve ser 'user_id'
    user_id: number,
    caption: string,
    // Deve ser 'first_media'
    first_media: any, 
    user: {
        id: any,
        name: string,
        avatar: string
    },
    // Deve ser 'image_count' e 'video_count'
    image_count: any, 
    video_count: any
}

type PaginetedResultModel = {
    data: CardPostModel[],
    current_page: number,
    next_page_url: string | null, // Deve ser 'next_page_url'
    total: number,
    // ... adicione todos os outros campos snake_case que você usa
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: any[],
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number
}

// ambos os metodos podem virar apenas um, assim como no home.store.ts, estudar essa situacao, a final quantos metods devo ter para que seja um codigo limpo
async function getPosts(): Promise<PaginetedResultModel> {
    const response = await http.get("/post");
    const rawData = response.data;

    return rawData;
}

async function getNextpage(nextUrl: string): Promise<PaginetedResultModel> {

    const response = await http.get(nextUrl);
    const rawData = response.data;

    return rawData;
}

export { getPosts, getNextpage}
export type {CardPostModel, PaginetedResultModel}