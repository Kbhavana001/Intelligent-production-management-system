/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/perform_login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/perform_logout': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  }
})
