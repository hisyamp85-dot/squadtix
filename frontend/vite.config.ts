import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:3333',
        changeOrigin: true
      },
      '/events': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/member-users': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/checkin': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/ping': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})
