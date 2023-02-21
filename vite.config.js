import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: "/lottery/",
  resolve: {
    alias: {
      '@':resolve('src')
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://www.loafer.online/lottery",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
