import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/proxy-auth': {
        target: 'https://hajjajlogin.hajj.gov.ly',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-auth/, ''),
      },
      '/proxy-api': {
        target: 'https://hajjaj.hajj.gov.ly',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-api/, ''),
      },
      '/proxy-time': {
        target: 'https://timeapi.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-time/, ''),
      },
    },
  },
})
