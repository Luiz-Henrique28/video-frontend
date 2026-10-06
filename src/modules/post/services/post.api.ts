import { http } from "../../../core/services/http";

type CreatePostData = {
  caption: string
  visibility: "public" | "private"
  tags: string[]
  files: File[]
}

function createPost(data: CreatePostData, onProgress?: (pct: number) => void) {
  const formData = new FormData()

  formData.append("visibility", data.visibility)
  if (data.caption) {
    formData.append("caption", data.caption)
  }

  data.tags.forEach((tag) => formData.append("tags[]", tag))
  data.files.forEach((file) => formData.append("files[]", file))

  return http.post<{ id: number }>("/post", formData, {
    onUploadProgress: (e) => {
      const total = e.total ?? (data.files.reduce((a, f) => a + f.size, 0) || 1)
      const pct = Math.min(100, Math.round((e.loaded * 100) / total))
      onProgress?.(pct)
    },
  })
}

type AddCommentData = {
  post_id: number | string
  content: string
}

async function addComment(data: AddCommentData): Promise<CommentModel> {
  const response = await http.post("/comment", {
    "post_id": data.post_id,
    "content": data.content
  })

  return response.data.result
}

type MediaModel = {
  id: number
  file_path: string
  media_type: "image" | "video"
  order: number
}

type CommentModel = {
  id: number
  user_id: number
  content: string
  created_at: string
  user?: UserModel
}

type TagModel = {
  id: number
  name: string
  slug: string
}

type PostDetailModel = {
  id: number
  user_id: number
  caption: string
  image_count: number
  video_count: number
  likes_count: number
  views_count: number
  is_liked: boolean
  created_at: string
  thumbnail_path: string | null
  user: UserModel
  media: MediaModel[]
  comment: CommentModel[]
  tag: TagModel[]
}

type UserModel = {
  id: number
  name: string
  email: string
  avatar: string
}

async function getPostById(id: number | string): Promise<PostDetailModel> {
  const postResult = await http.get(`/post/${id}`)
  return postResult.data
}

export {
  createPost,
  getPostById,
  addComment
}

export type {
  PostDetailModel,
  MediaModel,
  CommentModel,
  TagModel,
  UserModel
}