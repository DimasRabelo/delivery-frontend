import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- ADICIONE ESTE BLOCO ---
  server: {
    proxy: {
      // Qualquer chamada que comece com '/api'
      '/api': {
        // ...será redirecionada para a sua API Java
        target: 'http://localhost:8080',
        changeOrigin: true, // Necessário para a mágica funcionar
      }
    }
  }
  // --- FIM DO BLOCO ---
})