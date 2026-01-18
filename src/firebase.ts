// src/firebase.js
import { initializeApp } from "firebase/app";
// 1. IMPORTANTE: Importar os serviços de autenticação
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa o App do Firebase
const app = initializeApp(firebaseConfig);

// 2. Inicializa a Autenticação e o Provider do Google
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 3. Exporta para usar nas outras telas (Login.vue)
export { auth, googleProvider };