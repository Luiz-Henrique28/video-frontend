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

export {
  createPost,
  uploadMedia
}