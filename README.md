# Video Sharing Platform - Web Client

*Read this in [Portuguese](README.pt-br.md).*

![Vue.js](https://img.shields.io/badge/Vue.js-3.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

A Vue 3 web interface for a photo and video sharing platform. This repository contains only the Front-end (Client), which was developed to consume the **[main RESTful API built with Laravel (video-api)](https://github.com/Luiz-Henrique28/video-api)**.

## About the Project

This is a living personal project in active development. The core integration with the backend and authentication is already running, but there are still several improvement points on the radar (both UI/UX and new features) that I am implementing gradually. Some login providers, for example, are still in the interface only as placeholders. The ultimate idea is to build a robust media sharing platform where people can interact and share their content safely, quickly, and easily.

## Core Features

* **Authentication & Session:** Google login via Firebase, exchanging credentials for an API *Bearer Token* for secure communication.
* **Content Creation:** *Multipart* upload of heavy images and videos, with support for tags and visibility to improve categorization and discovery on the platform.
* **Interaction & Engagement:** Comment system already functional and integrated with the backend.
* **Dynamic Feed:** Infinite scroll and optimized pagination using the native `IntersectionObserver` API.
* **Global Search:** In-NavBar search system with *Debounce*, ensuring fast results without overloading the API with excessive requests.
* **Access Control:** Route protection using Vue Router *Navigation Guards* to manage visitors, logged-in users, and profiles with pending registration.
* **Social Expansion (WIP):** The interface already has the visual structure (placeholders) for likes, follow systems, and re-posts. Bringing reactivity to these actions with the database is the focus of the upcoming updates.

## Tech Stack

The idea was to keep a modern and strongly-typed stack:
* **Core:** Vue 3 (Composition API) + Vite + TypeScript
* **State Management:** Pinia (domain-separated)
* **Routing:** Vue Router
* **HTTP:** Axios (configured with interceptors to handle tokens and 401 errors)
* **Auth:** Firebase Authentication

---

## How to Run Locally

> ⚠️ **IMPORTANT:** Before running this Front-end, you **must** have the [Backend (video-api)](https://github.com/Luiz-Henrique28/video-api) configured and running on your machine. Without the API, the login and data will not load.

### 1. Environment Variables
Create a `.env` file in the root directory and configure your Firebase keys and the local API URL:

```env
VITE_APP_URL_SERVER=http://localhost:8000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Running the App

```bash
git clone [https://github.com/Luiz-Henrique28/video-frontend.git](https://github.com/Luiz-Henrique28/video-frontend.git)

cd video-frontend

npm install

npm run dev 
```

---

## Project Structure

The folder organization was designed to isolate generic components from business rules, making maintenance easier:

```text
src/
 ├── assets/styles/     # Global CSS and styles
 ├── core/              # App foundation (configs, router, Axios and Pinia instances)
 │   └── components/    # Dumb/Reusable components (e.g., buttons, NavBar)
 └── modules/           # Context-separated logic
     ├── auth/          # Login screens and stores
     ├── home/          # Everything feed-related
     ├── post/          # Post creation flow and details
     └── profile/       # User management
```