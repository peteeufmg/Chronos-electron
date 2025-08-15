import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Caso o projeto vá ser hospedado em um subdiretório, altere o valor de base.
  build: {
    outDir: 'dist', // Diretório onde o build será gerado
  },
})
