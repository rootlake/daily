import { defineConfig } from 'vite'
import { qrcode } from 'vite-plugin-qrcode'

export default defineConfig({
  plugins: [qrcode()],
  base: '/daily/',
  server: {
    host: true // needed for QR code to work
  },
  css: {
    devSourcemap: true
  }
}) 