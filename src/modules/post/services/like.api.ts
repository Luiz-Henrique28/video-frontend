import { http } from "../../../core/services/http";
import type { CardPostModel } from "../../../core/types";

type LikeResponse = {
  liked: boolean;
  likes_count: number;
};

type PaginatedLikedPostsModel = {
  data: CardPostModel[];
  current_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
  per_page: number;
  last_page: number;
};

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

