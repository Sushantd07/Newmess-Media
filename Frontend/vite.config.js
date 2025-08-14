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
  allowedHosts: [
  'localhost',
  '127.0.0.1',
  'gzd2rl1g-5173.inc1.devtunnels.ms',
  '.devtunnels.ms'
],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://2b812e3cf734.ngrok-free.app',
            'https://gzd2rl1g-5173.inc1.devtunnels.ms'
      ],
      credentials: true
    },
   hmr: {
  host: 'gzd2rl1g-5173.inc1.devtunnels.ms', // match your dev tunnel URL exactly
  protocol: 'wss',
  port: 443
}

},
})
