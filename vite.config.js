import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  
  // Fixed CSS configuration - removed modules config that was breaking Tailwind
  css: {
    postcss: './postcss.config.js',
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          maps: ['leaflet', 'react-leaflet'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  server: {
    port: 5173,
    open: true,
  },
  
  // Optional: Improve CSS handling in dev
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material'],
  },
})