export interface UserModel {
  id: number;
  name: string;
  email?: string;
  avatar: string | null;
}

export interface UserProfileModel {
  id: number;
  name: string;
  avatar: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  total_views?: number;
  /** null = usuario nao autenticado (perfil publico) */
  is_following: boolean | null;
  is_blocked?: boolean;
  hidden_count?: number;
}

export interface HiddenUserModel {
  id: number;
  name: string;
  avatar: string | null;
}

