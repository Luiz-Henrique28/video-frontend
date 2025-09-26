import { http } from "../../../core/services/http";

type CardPostModel = {
    id: number,
    userId: number,
    caption: string,
    firstMedia: any,
    user: any,
    imageCount: any,
    videoCount: any
}

function getPosts() {
    return http.get("/post")
}

export { getPosts}
export type {CardPostModel}