import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: './src/entry-client.tsx'
      }
    }
  },
  ssr: {
    noExternal: ['zustand']
  },
  server: {
    middlewareMode: false,
    port: 5173
  }
})