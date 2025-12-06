import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Seminar_Auditorium_Allocation_App/',
  build: {
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true
  }
})
