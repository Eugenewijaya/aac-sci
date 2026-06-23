import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AAC - Star Champs',
        short_name: 'AAC App',
        description: 'Aplikasi Komunikasi untuk Anak',
        theme_color: '#f59e0b',
        background_color: '#FFF9EA',
        display: 'standalone',
        orientation: 'landscape',
        icons: [
          {
            src: 'logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
