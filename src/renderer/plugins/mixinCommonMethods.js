import { exec } from 'child_process'
import Vue from 'vue'
// import { remote } from 'electron'
import { shell } from 'electron'

const fs = require('fs')
const platform = require('os').platform()

Vue.mixin({
  methods: {
    openURL (url) {
      shell.openExternal(url)
    },
    getDosboxInstallPath () {
      // this checks if the user has a dosbox installed at the path defined in settings
      // returns the path if found, otherwise returns null
      console.log('getDosboxInstallPath called')
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
        } else {
          return null
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
    },
    checkPackageManagerAvailability () {
      return new Promise((resolve, reject) => {
        console.log('Checking package manager availability')
        if (platform === 'win32') {
          exec('winget', (error, stdout, stderr) => {
            if (error || stderr) {
              console.log(`error: ${error.message}`)
              reject(new Error('Package manager not found'))
            } else if (stdout) {
              console.log('winget package manager available')
              resolve(true)
            }
          })
        } else {
          return true // todo: check for mac and linux
        }
      })
    },
    installDosbox () {
      return new Promise((resolve, reject) => {
        if (platform === 'win32') {
          exec('winget install -e --id DOSBox.DOSBox', (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`)
              reject(error.message)
            } else if (stderr) {
              console.log(`stderr: ${stderr}`)
              reject(stderr)
            } else {
              console.log(`stdout: ${stdout}`)
              resolve(stdout)
            }
          })
        } else {
          console.log('installDosbox: not implemented')
          return null
        }
      })
    }
  }
})
