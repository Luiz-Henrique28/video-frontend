import { http } from "../../../core/services/http";

// aqui vem minha funcao que faz a requisicao de criar post
function createPost(data: any) {

  try {
    const result = http.post("/post", {
      "user_id": data.userId,
      "caption": data.caption,
      "visibility": data.visibility,
      "tags": data.tags
    });

    return result;

  } catch (error) {
    console.log("entrou aqui")
    console.log(error)
  }

}

type AddCommentData = {
  user_id: number
  post_id: number | string
  content: string
}

async function addComment(data: AddCommentData): Promise<CommentModel> {
  const response = await http.post("/comment", {
    "user_id": data.user_id,
    "post_id": data.post_id,
    "content": data.content
  })

  return response.data.result
}

// Types baseados na resposta da API (apenas campos essenciais para o frontend)
type MediaModel = {
  id: number
  file_path: string
  media_type: 'image' | 'video'
  order: number
}

type CommentModel = {
  id: number
  user_id: number
  content: string
  created_at: string  // Útil para mostrar "há 2 horas"
  user?: UserModel
}

type TagModel = {
  id: number
  name: string  // Para exibir: #Laravel, #PHP, etc.
  slug: string  // Para URLs: /tags/laravel, /tags/php
}

type PostDetailModel = {
  id: number
  user_id: number
  caption: string,
  image_count: number,
  video_count: number,
  created_at: string  // Útil para "Postado há 3 dias"
  thumbnail_path: string | null
  user: UserModel     // ← Dados do usuário incluídos
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

function uploadMedia(

  files: File[],
  postId: string,
  userId: string,
  onProgress?: (pct: number) => void,
  signal?: AbortSignal

) {
  const formData = new FormData()

  formData.append("user_id", userId);
  formData.append("post_id", postId);

  files.forEach(file => {
    console.log("entrou aqui", file)

    formData.append("files[]", file);
  });

  console.log("Início da Checagem do FormData");
  for (const [key, value] of formData.entries()) {
    // Para arquivos, o valor será o objeto File. Para strings (user_id), será a string.
    console.log(`${key}:`, value);
  }

  return http.post("/media", formData, {
    signal,

    onUploadProgress: (e) => {
      const total = (e.total) ?? (files.reduce((a, f) => a + f.size, 0) || 1)
      const pct = Math.min(100, Math.round((e.loaded * 100) / total))
      onProgress?.(pct)
    },
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // }
  });

}

async function getPostById(id: number | string): Promise<PostDetailModel> {
  const postResult = await http.get(`/post/${id}`)
  return postResult.data
}



// async function getUserById(id: number | string): Promise<UserModel> {
//   const userResult = await http.get(`/user/${id}`)
//   return userResult.data
// }

export {
  createPost,
  uploadMedia,
  getPostById,
  addComment
  // getUserById
}

export type {
  PostDetailModel,
  MediaModel,
  CommentModel,
  TagModel,
  UserModel
}