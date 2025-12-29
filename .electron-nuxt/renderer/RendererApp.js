const path = require('path')
const { fork } = require('child_process')
const { utils } = require('@xpda-dev/core')
const { killWithAllSubProcess } = utils

const RENDERER_PROCESS_PATH = path.join(__dirname, 'renderer-process.js')

class RendererApp {
  constructor (logger) {
    this.logger = logger
  }

  async build (isDev) {
    this.rendererProcess = fork(RENDERER_PROCESS_PATH, { silent: true })
    this.redirectStdout()
    return new Promise((resolve, reject) => {
      this.rendererProcess.send({ action: 'build', target: isDev ? 'development' : 'production' })
      this.rendererProcess.once('message', ({ status, err }) => {
        if (status === 'ok') resolve()
        else reject(err)
      })
    })
  }

  redirectStdout () {
    this.rendererProcess.stdout.pipe(this.logger.stdout)
    this.rendererProcess.stderr.pipe(this.logger.stderr)
  }

  async terminate () {
    if (!this.rendererProcess) return
    this.rendererProcess.kill()
    if (this.rendererProcess && !this.rendererProcess.killed) {
      killWithAllSubProcess(this.rendererProcess.pid)
    }
    this.rendererProcess = null
  }
}

module.exports = RendererApp
