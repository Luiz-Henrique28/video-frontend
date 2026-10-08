import { http } from "../../../core/services/http";
import type {
  PostDetailModel,
  MediaModel,
  CommentModel,
  TagModel,
  UserModel
} from "../../../core/types";

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

  return (response.data as any).data ?? response.data.result
}

async function getPostById(id: number | string): Promise<PostDetailModel> {
  const postResult = await http.get(`/post/${id}`)
  return (postResult.data as any).data ?? postResult.data
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
