import { http } from "../../../core/services/http";
import type { CardPostModel } from "../../../core/types";
import type { PaginatedResultModel } from "../../../core/types/common.types";

async function getPosts(): Promise<PaginatedResultModel<CardPostModel>> {
    const response = await http.get("/post");
    return response.data;
}

async function getNextpage(nextUrl: string): Promise<PaginatedResultModel<CardPostModel>> {
    const response = await http.get(nextUrl);
    return response.data;
}

export { getPosts, getNextpage };
export type { CardPostModel, PaginatedResultModel };
