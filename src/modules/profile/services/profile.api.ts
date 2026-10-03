import { http } from "../../../core/services/http";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserProfileModel = {
  id: number;
  name: string;
  avatar: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  profile_views_count?: number;
  /** null = usuário não autenticado (perfil público) */
  is_following: boolean | null;
};

export type FollowResponse = {
  following: boolean;
  followers_count: number;
};

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Busca o perfil público de um usuário pelo username.
 * Se autenticado, a resposta inclui `is_following`.
 */
export async function getUserProfile(username: string): Promise<UserProfileModel> {
  const response = await http.get(`/user/${username}`);
  return response.data.data;
}

/**
 * Busca os posts de um usuário pelo ID (paginado).
 */
export async function getUserPosts(userId: number, page = 1) {
  
  const response = await http.get(`/user/${userId}/posts`, { params: { page } });
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


/**
 * 1. Sistema de Tags e Likes

Criar tabelas e migrations (tags, post_tag, likes).

Desenvolver os endpoints para curtir/descurtir e vincular tags ao salvar posts.

Implementar o input de tags (vue-multiselect) na criação do post.

Criar a interface do botão de Like com Atualização Otimista (Optimistic UI) no Vue.

2. Sistema de Follows e Evolução do Perfil

Adicionar novos campos na tabela users (bio, avatar_path, banner_path).

Criar a tabela pivô followers para a relação de seguir/seguido.

Atualizar o endpoint do Perfil para retornar contadores integrados (withCount de seguidores, likes recebidos e posts).

Desenvolver a UI do Perfil público (cabeçalho com banner/avatar, contadores, botão "Seguir" e grade de álbuns).

Criar o endpoint e a interface do feed "Inscrições" (Posts de quem o usuário segue).

3. Configurações da Conta (Settings)

Desenvolver endpoints dedicados para upload, redimensionamento e salvamento de Avatar e Banner.

Criar o painel de configurações no Vue dividido por abas (Editar Perfil, Segurança/Conta).

Integrar as funções de alteração de senha e exclusão de conta já mapeadas na API.

4. Infraestrutura e Processamento de Mídia

Configurar credenciais do Cloudflare R2 (ou S3) no Laravel (config/filesystems.php e .env).

Alterar o MediaController para enviar uploads de imagens e vídeos direto para o Object Storage.

Refatorar o Job GenerateThumbFromVideo para baixar o vídeo do R2 para /tmp, rodar o FFmpeg localmente, subir a capa gerada para o R2 e limpar os rastros.

Integrar um player de vídeo moderno (Video.js ou Plyr) no módulo de visualização do post.

5. Monetização e Interface de Anúncios

Criar um componente isolado no Vue (<AdBanner/>).

Injetar o componente dinamicamente dentro do laço de repetição do Feed (ex: a cada 8 posts).

Posicionar blocos fixos de anúncio abaixo do player de mídia e acima da seção de comentários.
 * 
 * 
 */