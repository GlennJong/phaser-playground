import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  mode: "normal",
  base: './',
  plugins: [
      react(),
      // mkcert()
  ]
})
