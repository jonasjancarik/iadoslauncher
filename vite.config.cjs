const path = require('path')
const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const { SERVER_PORT } = require('./.electron-nuxt/config')

module.exports = defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  plugins: [react()],
  server: {
    port: SERVER_PORT,
    strictPort: true
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true
  }
})
