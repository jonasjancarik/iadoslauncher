import { exec } from 'child_process'
import Vue from 'vue'
const fs = require('fs')

Vue.mixin({
  methods: {
    checkDosBoxInstallation () {
      const platform = require('os').platform()
      if (platform === 'win32') {
        // look for DOSBox installation in the default location
        let dosboxdirs = []
        fs.readdirSync(this.settings.dosBoxExePath.value.split('\\').slice(0, -2).join('\\')).forEach(file => {
          if (file.toLowerCase().startsWith('dosbox')) {
            dosboxdirs.push(this.settings.dosBoxExePath.value.split('\\').slice(0, -2).join('\\') + '\\' + file)
          }
        })
        if (dosboxdirs.length) {
          dosboxdirs = dosboxdirs.sort()
          if (fs.readdirSync(dosboxdirs[dosboxdirs.length - 1]).includes('DOSBox.exe')) { // todo: loop through all from the newest version
            // this.dosBoxFoundPath = dosboxdirs[dosboxdirs.length - 1] + '\\DOSBox.exe'
            return dosboxdirs[dosboxdirs.length - 1] + '\\DOSBox.exe'
          } else {
            return null
          }
        }
      } else {
        exec(`which ${this.settings.dosBoxExePath.value}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`)
            return null
          } else if (stderr) {
            console.log(`stderr: ${stderr}`)
            return null
          } else {
            // this.dosBoxFoundPath = this.settings.dosBoxExePath.value
            console.log(`stdout: ${stdout}`)
            return this.settings.dosBoxExePath.value
          }
        })
      }
    }
  }
})
