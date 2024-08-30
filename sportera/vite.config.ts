import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    host: true, // Add this line
    port: 5173  // This is usually the default port
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      'mapkit': path.resolve(__dirname, './src/mapkit.d.ts'),
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
})