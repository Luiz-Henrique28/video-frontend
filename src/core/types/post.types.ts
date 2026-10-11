import type { UserModel } from './user.types';

export interface MediaModel {
  id: number;
  post_id?: number;
  file_path: string;
  storage_url?: string;
  media_type?: 'image' | 'video';
  file_type?: 'image' | 'video';
  order: number;
  thumbnail_url?: string;
}

export interface CommentModel {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: UserModel;
}

export interface TagModel {
  id: number;
  name: string;
  slug?: string;
}

export interface PostDetailModel {
  id: number;
  user_id?: number;
  caption: string;
  image_count: number;
  video_count: number;
  likes_count: number;
  views_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  thumbnail_path: string | null;
  user: UserModel;
  media: MediaModel[];
  comment: CommentModel[];
  tag: TagModel[];
}

export interface CardPostModel {
  id: number;
  user_id?: number;
  caption: string;
  thumbnail_path: string;
  first_media?: any;
  user: UserModel;
  image_count?: any;
  video_count?: any;
  views_count?: number;
}
