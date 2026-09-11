import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // 判斷開發中，還是產品(production)的路徑
  base: process.env.NODE_ENV === 'production' ? '/202607_vite-project/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ]
})


