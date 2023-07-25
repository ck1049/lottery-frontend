import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // publicDir: "/lottery-frontend/",
  resolve: {
    alias: {
      '@':resolve('src')
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      "/lottery": {
        target: "http://www.loafer.online/lottery",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lottery/, "")
      }
    }
  }
})
