# Video Sharing Platform - Web Client

![Vue.js](https://img.shields.io/badge/Vue.js-3.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

Interface web em Vue 3 para uma plataforma de compartilhamento de fotos e vídeos. Este repositório contém apenas o Front-end (Client), que foi desenvolvido para consumir a **[API RESTful principal feita em Laravel (video-api)](https://github.com/Luiz-Henrique28/video-api)**. 

## Sobre o Projeto

Este é um projeto pessoal vivo e em desenvolvimento. A integração principal com o backend e autenticação já está rodando, mas ainda há vários pontos de melhoria no radar (tanto de UI/UX quanto de novas features) que venho implementando aos poucos. Alguns provedores de login, por exemplo, ainda estão na interface apenas como placeholders. A ideia final é construir uma plataforma robusta de compartilhamento de mídia, onde as pessoas possam interagir e compartilhar seus conteúdos de forma segura, rápida e fácil.

## Principais Recursos

* **Autenticação e Sessão:** Login com Google via Firebase, trocando as credenciais por um *Bearer Token* da API para comunicação segura.
* **Criação de Conteúdo:** Upload *multipart* de imagens e vídeos pesados, com suporte a tags e visibilidade para melhorar a categorização e descoberta na plataforma.
* **Interação e Engajamento:** Sistema de comentários já funcional e integrado ao backend.
* **Feed Dinâmico:** Scroll infinito e paginação otimizada utilizando a API nativa `IntersectionObserver`.
* **Busca Global:** Sistema de pesquisa no NavBar com *Debounce*, garantindo resultados rápidos sem sobrecarregar a API com requisições excessivas.
* **Controle de Acesso:** Proteção de rotas com *Navigation Guards* do Vue Router para gerenciar visitantes, usuários logados e perfis com cadastro pendente.
* **Expansão Social (WIP):** A interface já conta com a estrutura visual (placeholders) para curtidas (likes), sistema de seguidores (follows) e recompartilhamento (re-posts). A reatividade dessas ações com o banco de dados é o foco das próximas atualizações.

## Tecnologias Utilizadas

A ideia foi manter uma stack moderna e tipada:
* **Core:** Vue 3 (Composition API) + Vite + TypeScript
* **Estado:** Pinia (separado por domínios)
* **Rotas:** Vue Router
* **HTTP:** Axios (configurado com interceptors para lidar com tokens e erros 401)
* **Auth:** Firebase Authentication

---

## Como Executar Localmente

> ⚠️ **IMPORTANTE:** Antes de rodar este Front-end, você **precisa** estar com o [Backend (video-api)](https://github.com/Luiz-Henrique28/video-api) configurado e rodando na sua máquina. Sem a API, o login e os dados não vão carregar.

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e configure suas chaves do Firebase e a URL da API local:

```env
VITE_APP_URL_SERVER=http://localhost:8000/api
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 2. Rodando o app

```bash
git clone [https://github.com/Luiz-Henrique28/video-frontend.git](https://github.com/Luiz-Henrique28/video-frontend.git)

cd video-frontend

npm install

npm run dev 
```

---

## Estrutura do Projeto

A organização das pastas foi pensada para isolar componentes genéricos das regras de negócio, facilitando a manutenção:

```text
src/
 ├── assets/styles/     # CSS e estilos globais
 ├── core/              # A base do app (configurações, router, instâncias do Axios e Pinia)
 │   └── components/    # Componentes burros/reutilizáveis (ex: botões, NavBar)
 └── modules/           # As lógicas separadas por contexto
     ├── auth/          # Telas e stores de login
     ├── home/          # Tudo que envolve o feed
     ├── post/          # Fluxo de criação e detalhes da postagem
     └── profile/       # Gestão do usuário
```
