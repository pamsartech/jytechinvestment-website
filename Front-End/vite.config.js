
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'


export default defineConfig({
  plugins: [react() , tailwindcss()],
    server: {
    proxy: {
      "/api": {
        target: "https://jytec-investment-api.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})


