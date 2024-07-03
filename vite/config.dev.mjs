import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    mode: 'dev',
    base: './',
    plugins: [
        react(),
    ],
    experimental: {
        acceptExports: true,
    },
    mete: {
        hot: { acceptExports: true }
    },
    server: {
        host: true,
        port: 8000,
        sourcemap: true,

    },
    preview: {
        host: true,
        port: 8000,
        sourcemap: true,
    } 
})
