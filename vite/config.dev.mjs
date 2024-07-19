import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert'

const proxySetting = {
    '/api': {
        target: 'http://localhost:8001/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
    },
    '/socket': {
        target: 'ws://localhost:8002',
        ws: true
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    mode: 'dev',
    base: './',
    plugins: [
        react(),
        // mkcert()
    ],
    // experimental: {
    //     acceptExports: true,
    // },
    // mete: {
    //     hot: { acceptExports: true }
    // },
    server: {
        // https: true,
        host: true,
        port: 8000,
        proxy: proxySetting,
        sourcemap: true,
    },
    preview: {
        // https: true,
        host: true,
        port: 8000,
        proxy: proxySetting,
        sourcemap: true,
    } ,
})
