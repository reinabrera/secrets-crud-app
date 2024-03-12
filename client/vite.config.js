import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

const url = process.env.VITE_API_URL;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: url,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
