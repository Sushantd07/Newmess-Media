import { defineConfig } from 'vite'
import path from 'node:path'
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
  build: {
    manifest: true,
    outDir: 'dist'
  },
  // Ensure only a single copy of React is used to avoid "Invalid hook call"
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    }
  },
server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'gzd2rl1g-5173.inc1.devtunnels.ms',
      '.devtunnels.ms',
      '5c488ddea99b.ngrok-free.app',
      '.ngrok-free.app'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Serve dynamic sitemap from backend while developing frontend
      '/sitemap.xml': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap.json': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/robots.txt': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/category-icons': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/company-logos': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    cors: {
      origin: [
        'http://localhost:5173',
     
      ],
      credentials: true
    },
    // Use default local HMR on the chosen port

},
})
