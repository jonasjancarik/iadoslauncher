const path = require('path')
const { build, createServer } = require('vite')
const react = require('@vitejs/plugin-react')
const { SERVER_PORT, RENDERER_PROCESS_DIR, DIST_DIR } = require('../config')

const viteConfig = {
  root: RENDERER_PROCESS_DIR,
  base: './',
  plugins: [react()],
  server: {
    port: SERVER_PORT,
    strictPort: true
  },
  build: {
    outDir: path.join(DIST_DIR, 'renderer'),
    emptyOutDir: true
  }
}

process.on('message', async ({ action, target }) => {
  if (action !== 'build') {
    process.send({ status: 'error', err: `Renderer process: unknown action ('${action}')` })
    return
  }

  try {
    if (target === 'development') {
      const server = await createServer(viteConfig)
      await server.listen()
      process.send({ status: 'ok' })
    } else {
      await build(viteConfig)
      process.send({ status: 'ok' })
      process.exit(0)
    }
  } catch (err) {
    console.error(err)
    process.send({ status: 'error', err: err.message })
  }
})
