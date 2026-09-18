import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Media is copied into public/media/nfa for a self-contained build.
export default defineConfig({
  plugins: [react()],
})
