import { http } from "../../../core/services/http";

type LikeResponse = {
  liked: boolean;
  likes_count: number;
};

async function likePost(postId: number | string): Promise<LikeResponse> {
  const response = await http.post(`/post/${postId}/like`);
  return response.data;
}

async function unlikePost(postId: number | string): Promise<LikeResponse> {
  const response = await http.delete(`/post/${postId}/like`);
  return response.data;
}

export { likePost, unlikePost };
export type { LikeResponse };
