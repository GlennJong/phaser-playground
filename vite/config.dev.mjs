import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    mode: 'dev',
    base: './',
    plugins: [
        react(),
        mkcert()
    ],
    experimental: {
        acceptExports: true,
    },
    mete: {
        hot: { acceptExports: true }
    },
    server: {
        https: true,
        host: true,
        port: 8000,
        sourcemap: true,
    },
    preview: {
        https: true,
        host: true,
        port: 8000,
        sourcemap: true,
    } 
})
