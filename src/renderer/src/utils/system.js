const { exec, execSync } = window.require('child_process')
const { shell } = window.require('electron')
const fs = window.require('fs')
const os = window.require('os')

export const openURL = (url) => {
  shell.openExternal(url)
}

export const getDosboxInstallPath = (settings) => {
  const platform = os.platform()
  if (platform === 'win32') {
    const base = settings.dosBoxExePath.value.split('\\').slice(0, -2).join('\\')
    if (!fs.existsSync(base)) {
      return null
    }
    const dosboxDirs = fs
      .readdirSync(base)
      .filter((file) => file.toLowerCase().startsWith('dosbox'))
      .map((file) => `${base}\\${file}`)
      .sort()
    if (!dosboxDirs.length) return null
    const newest = dosboxDirs[dosboxDirs.length - 1]
    if (fs.existsSync(`${newest}\\DOSBox.exe`)) {
      return `${newest}\\DOSBox.exe`
    }
    return null
  }

  if (platform === 'darwin') {
    try {
      execSync(`ls ${settings.dosBoxExePath.value}`)
      return settings.dosBoxExePath.value
    } catch (error) {
      console.error(`execSync error: ${error.message}`)
      return null
    }
  }

  try {
    execSync(`which ${settings.dosBoxExePath.value}`)
    return settings.dosBoxExePath.value
  } catch (error) {
    console.error(`execSync error: ${error.message}`)
    return null
  }
}

export const checkPackageManagerAvailability = () => {
  const platform = os.platform()
  return new Promise((resolve, reject) => {
    if (platform === 'win32') {
      exec('winget', (error, stdout, stderr) => {
        if (error || stderr) {
          reject(new Error('Package manager not found'))
        } else if (stdout) {
          resolve(true)
        }
      })
    } else if (platform === 'darwin') {
      exec('brew info', (error, stdout, stderr) => {
        if (error || stderr) {
          reject(new Error('Package manager not found'))
        } else if (stdout) {
          resolve(true)
        }
      })
    } else {
      resolve(true)
    }
  })
}

export const installDosbox = () => {
  const platform = os.platform()
  return new Promise((resolve, reject) => {
    if (platform === 'win32') {
      exec('winget install -e --id DOSBox.DOSBox', (error, stdout, stderr) => {
        if (error) {
          reject(error.message)
        } else if (stderr) {
          reject(stderr)
        } else {
          resolve(stdout)
        }
      })
    } else if (platform === 'darwin') {
      exec('brew install --cask dosbox', (error, stdout, stderr) => {
        if (error) {
          reject(error.message)
        } else if (stderr) {
          reject(stderr)
        } else {
          resolve(stdout)
        }
      })
    } else {
      reject(new Error('installDosbox: not implemented for this platform'))
    }
  })
}
