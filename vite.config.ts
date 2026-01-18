import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // ADICIONE ESTA PARTE DO SERVER:
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    }
  }
})
