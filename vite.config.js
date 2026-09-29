import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load properly on any domain, subpath, or hosting provider
  server: {
    host: true, // Exposes to local network (test on phone or other devices)
    open: true, // Automatically opens Chrome / default browser
  },
})

