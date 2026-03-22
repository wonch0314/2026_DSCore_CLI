import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 로컬 dscore-ui-vue 패키지 연결
      'dscore-ui-vue': resolve(__dirname, '../dscore-ui-vue/src')
    }
  }
})
