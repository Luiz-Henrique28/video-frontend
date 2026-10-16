import { http } from "../../../core/services/http";
import type { CardPostModel } from "../../../core/types";
import type { PaginatedResultModel } from "../../../core/types/common.types";

type LikeResponse = {
  liked: boolean;
  likes_count: number;
};

type PaginatedLikedPostsModel = PaginatedResultModel<CardPostModel>;

async function likePost(postId: number | string): Promise<LikeResponse> {
  const response = await http.post(`/post/${postId}/like`);
  return response.data;
}

async function unlikePost(postId: number | string): Promise<LikeResponse> {
  const response = await http.delete(`/post/${postId}/like`);
  return response.data;
}

async function getLikedPosts(url?: string): Promise<PaginatedLikedPostsModel> {
  const endpoint = url || "/user/liked-posts";
  const response = await http.get(endpoint);
  return response.data;
}

export { likePost, unlikePost, getLikedPosts };
export type { LikeResponse, PaginatedLikedPostsModel };
