import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // ⭐ ADD THIS BLOCK (FIX FOR sockjs global error)
  define: {
    global: 'window',
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4550',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://127.0.0.1:4550',
        changeOrigin: true,
      },
    },
  },
})