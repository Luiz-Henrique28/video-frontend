📘 Guia de Nomenclatura - Projeto Video Frontend
🎯 Padrão Geral
[módulo][Contexto].[tipo].ts
módulo: Nome do domínio/feature (post, user, home, etc.)
Contexto: Ação ou responsabilidade específica (Detail, Creation, List, etc.)
tipo: Tipo do arquivo (store, api, vue, etc.)
📁 Estrutura de Módulos
src/modules/[modulo]/
├── components/          → Componentes reutilizáveis do módulo
├── services/           → Chamadas de API
│   └── [modulo].api.ts
├── store/              → Gerenciamento de estado
│   └── [modulo][Contexto].store.ts
└── views/              → Páginas/Views
    └── [Modulo][Contexto]Page.vue
🗂️ Nomenclatura por Tipo de Arquivo
1. Views (Páginas) .vue
Padrão: [Modulo][Contexto]Page.vue
HomePage.vue              → Página inicial
PostDetailPage.vue        → Página de detalhes do post
PostCreationPage.vue      → Página de criação de post
PostEditPage.vue          → Página de edição de post
UserProfilePage.vue       → Página de perfil do usuário
LoginPage.vue             → Página de login
SettingsPage.vue          → Página de configurações
Regras:
✅ Sempre PascalCase
✅ Sempre terminar com Page.vue
✅ Ser descritivo sobre a funcionalidade
❌ Nunca usar verbos sozinhos (CreatePost.vue)
2. Stores (Pinia) .store.ts
Padrão: [modulo][Contexto].store.ts Nome da função: use[Modulo][Contexto]Store
// Arquivo: postDetail.store.ts
export const usePostDetailStore = defineStore('postDetail', { ... })

// Arquivo: postCreation.store.ts
export const usePostCreationStore = defineStore('postCreation', { ... })

// Arquivo: home.store.ts (quando só tem uma store no módulo)
export const useHomeStore = defineStore('home', { ... })

// Arquivo: userProfile.store.ts
export const useUserProfileStore = defineStore('userProfile', { ... })

// Arquivo: auth.store.ts
export const useAuthStore = defineStore('auth', { ... })
Contextos comuns:
Detail       → Visualizar detalhes (ler)
Creation     → Criar novo item
Edit         → Editar item existente
List         → Listar múltiplos itens
Profile      → Perfil/dados do usuário
Settings     → Configurações
Regras:
✅ camelCase para arquivo: postDetail.store.ts
✅ PascalCase para função: usePostDetailStore
✅ Nome no defineStore igual ao arquivo: defineStore('postDetail', ...)
❌ Nunca usar verbos: postCreate.store.ts → use postCreation.store.ts
3. Services (API) .api.ts
Padrão: [modulo].api.ts
// Arquivo: post.api.ts
export async function getPostById(id: number) { ... }
export async function createPost(data: CreatePostDto) { ... }
export async function updatePost(id: number, data: UpdatePostDto) { ... }
export async function deletePost(id: number) { ... }

// Arquivo: home.api.ts
export async function getPosts() { ... }
export async function getNextPage(url: string) { ... }

// Arquivo: user.api.ts
export async function getUserProfile(id: number) { ... }
export async function updateUserProfile(data: UserDto) { ... }
Regras:
✅ Um arquivo por módulo
✅ Funções em camelCase com verbos claros: getPostById, createPost
✅ Export de tipos relacionados no mesmo arquivo
4. Components .vue
Padrão: [Nome]Component.vue ou apenas [Nome].vue
PostCard.vue              → Card de post
CommentList.vue           → Lista de comentários
UserAvatar.vue            → Avatar do usuário
MediaUploader.vue         → Componente de upload
TagInput.vue              → Input de tags
Regras:
✅ PascalCase
✅ Nome descritivo da função
❌ Não usar sufixo "Component" (opcional, mas desnecessário)
📋 Exemplos Práticos por Módulo
Módulo: Post
src/modules/post/
├── components/
│   ├── PostCard.vue
│   ├── CommentList.vue
│   └── MediaGallery.vue
├── services/
│   └── post.api.ts
├── store/
│   ├── postCreation.store.ts
│   ├── postDetail.store.ts
│   └── postEdit.store.ts
└── views/
    ├── PostCreationPage.vue
    ├── PostDetailPage.vue
    └── PostEditPage.vue
Módulo: User
src/modules/user/
├── components/
│   ├── UserAvatar.vue
│   └── UserCard.vue
├── services/
│   └── user.api.ts
├── store/
│   ├── userProfile.store.ts
│   └── userSettings.store.ts
└── views/
    ├── UserProfilePage.vue
    └── UserSettingsPage.vue
Módulo: Home
src/modules/home/
├── components/
│   └── PostCard.vue
├── services/
│   └── home.api.ts
├── store/
│   └── home.store.ts        ← Sem contexto (só tem uma)
└── views/
    └── HomePage.vue
Módulo: Auth
src/modules/auth/
├── services/
│   └── auth.api.ts
├── store/
│   └── auth.store.ts
└── views/
    ├── LoginPage.vue
    ├── RegisterPage.vue
    └── ForgotPasswordPage.vue
✅ Checklist de Nomenclatura
Antes de criar um arquivo, pergunte:
 O nome está em PascalCase (views/components) ou camelCase (stores/services)?
 O nome é descritivo o suficiente?
 Estou usando substantivos ao invés de verbos (Creation, não Create)?
 O arquivo está na pasta correta?
 O nome da função/export segue o padrão do arquivo?
🚫 Erros Comuns para Evitar
❌ CreatePost.vue          → ✅ PostCreationPage.vue
❌ postCreate.store.ts     → ✅ postCreation.store.ts
❌ post.vue                → ✅ PostDetailPage.vue
❌ useCreatePostStore      → ✅ usePostCreationStore
❌ getPost                 → ✅ getPostById (seja específico)
❌ Post.api.ts             → ✅ post.api.ts (camelCase)
📝 Template de Referência Rápida
// ==================== VIEWS ====================
// Padrão: [Modulo][Contexto]Page.vue
HomePage.vue
PostDetailPage.vue
PostCreationPage.vue
UserProfilePage.vue

// ==================== STORES ====================
// Arquivo: [modulo][Contexto].store.ts
// Função: use[Modulo][Contexto]Store

// home.store.ts
export const useHomeStore = defineStore('home', { ... })

// postDetail.store.ts
export const usePostDetailStore = defineStore('postDetail', { ... })

// postCreation.store.ts
export const usePostCreationStore = defineStore('postCreation', { ... })

// ==================== SERVICES ====================
// Arquivo: [modulo].api.ts

// post.api.ts
export async function getPostById(id: number) { ... }
export async function createPost(data: any) { ... }

// ==================== COMPONENTS ====================
// Padrão: [Nome].vue
PostCard.vue
UserAvatar.vue
CommentList.vue
