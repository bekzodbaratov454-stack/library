import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3001,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/books': 'http://localhost:3000',
      '/borrow': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
})