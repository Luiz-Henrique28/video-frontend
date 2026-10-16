import { http } from "../../../core/services/http";
import type { CardPostModel } from "../../../core/types";
import type { PaginatedResultModel } from "../../../core/types/common.types";

type SaveResponse = {
  saved: boolean;
};

type PaginatedSavedPostsModel = PaginatedResultModel<CardPostModel>;

async function savePost(postId: number | string): Promise<SaveResponse> {
  const response = await http.post(`/post/${postId}/save`);
  return response.data;
}

async function unsavePost(postId: number | string): Promise<SaveResponse> {
  const response = await http.delete(`/post/${postId}/save`);
  return response.data;
}

async function getSavedPosts(url?: string): Promise<PaginatedSavedPostsModel> {
  const endpoint = url || "/user/saved-posts";
  const response = await http.get(endpoint);
  return response.data;
}

export { savePost, unsavePost, getSavedPosts };
export type { SaveResponse, PaginatedSavedPostsModel };
