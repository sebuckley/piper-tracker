import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { reactCompilerPreset } from '@vitejs/plugin-react'

export default defineConfig({
  base: '/piper-tracker/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: { hmr: false }
})
