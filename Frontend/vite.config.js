import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
     svgr(),
    tailwindcss(),
    
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      protocol: 'wss',
      host: 'eb20f4e8cbd4.ngrok-free.app', // ✅ Your Ngrok host
      port: 443, // ✅ Use 443 for HTTPS wss
    },
  },
})
