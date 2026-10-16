import { http } from "../../../core/services/http";
import type { CardPostModel, HiddenUserModel } from "../../../core/types";
import type { PaginatedResultModel } from "../../../core/types/common.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserProfileModel = {
  id: number;
  name: string;
  avatar: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  total_views?: number;
  /** null = usuário não autenticado (perfil público) */
  is_following: boolean | null;
  is_blocked?: boolean;
  hidden_count?: number;
  reposts_count?: number;
};

export type FollowResponse = {
  following: boolean;
  followers_count: number;
};

export type BlockResponse = {
  blocked: boolean;
  hidden_count: number;
};

export type PaginatedHiddenUsersModel = PaginatedResultModel<HiddenUserModel>;

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Busca o perfil público de um usuário pelo username.
 * Se autenticado, a resposta inclui `is_following`.
 */
export async function getUserProfile(username: string): Promise<UserProfileModel> {
  const response = await http.get(`/user/${username}`);
  return (response.data as any)?.data ?? response.data;
}

/**
 * Busca os posts de um usuário pelo ID (paginado).
 */
export async function getUserPosts(userId: number, page = 1, type: 'all' | 'posts' | 'reposts' = 'all'): Promise<PaginatedResultModel<CardPostModel>> {
  const response = await http.get(`/user/${userId}/posts`, { params: { page, type } });
  return response.data;
}

/**
 * Seguir um usuário.
 */
export async function followUser(userId: number): Promise<FollowResponse> {
  const response = await http.post(`/user/${userId}/follow`);
  return response.data;
}

/**
 * Deixar de seguir um usuário.
 */
export async function unfollowUser(userId: number): Promise<FollowResponse> {
  const response = await http.delete(`/user/${userId}/follow`);
  return response.data;
}

export async function updateUsernameApi(name: string) {
  const response = await http.patch('/user/username', { name });
  return response.data;
}

export async function updatePasswordApi(password: string) {
  const response = await http.put('/user/password', { password });
  return response.data;
}

export async function updateOptionsApi(options: Record<string, any>) {
  const response = await http.put('/user/options', options);
  return response.data;
}

export async function updateAvatarApi(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await http.post('/user/avatar', formData);
  return response.data;
}

export async function blockUser(userId: number): Promise<BlockResponse> {
  const response = await http.post(`/user/${userId}/block`);
  return response.data;
}

export async function unblockUser(userId: number): Promise<BlockResponse> {
  const response = await http.delete(`/user/${userId}/block`);
  return response.data;
}

export async function getHiddenUsers(url?: string): Promise<PaginatedHiddenUsersModel> {
  const endpoint = url || '/user/hiddens';
  const response = await http.get(endpoint);
  return response.data;
}
