const platformDefaults = {}

const platform = require('os').platform()
const homedir = require('os').homedir()
const tempdir = require('os').tmpdir()

switch (platform) {
case 'win32':
  platformDefaults.dosBoxExePath = 'C:\\Program Files (x86)\\DOSBox-0.74-3\\DOSBox.exe'
  platformDefaults.installDirPathBase = 'C:\\Program Files (x86)\\IADOS Launcher\\games\\'
  platformDefaults.downloadDirPath = tempdir + '\\IADOS Launcher\\'
  break

default:
  platformDefaults.dosBoxExePath = 'dosbox'
  platformDefaults.installDirPathBase = homedir + '/.iadoslauncher/games/'
  platformDefaults.downloadDirPath = '/tmp/iadoslauncher/'
  break
}

export const state = () => ({
  dosBoxExePath: {
    label: 'DOSBox Executable Path',
    description: 'Location of the DOSBox .exe file - on Mac OS and Linux this should probably be just "dosbox"',
    default: platformDefaults.dosBoxExePath,
    value: platformDefaults.dosBoxExePath
  },
  dosBoxFlags: {
    label: 'DOSBox command line parameters',
    description: 'These parameters are used to specify options for running the game - see https://www.dosbox.com/wiki/Usage#Command_Line_Parameters',
    default: [
      '-noconsole',
      '-aspect'
    ],
    value: [
      // '-fullscreen',
      '-noconsole',
      '-aspect'
    ]
  },
  installDirPathBase: {
    label: 'Installation directory',
    description: 'Directory in which games installed by this app are stored',
    default: platformDefaults.installDirPathBase,
    value: platformDefaults.installDirPathBase
  },
  downloadDirPath: {
    label: 'Download directory',
    description: 'Path to the (temporary) directory to which the games are downloaded before being installed',
    default: platformDefaults.downloadDirPath,
    value: platformDefaults.downloadDirPath
  }
})

export const mutations = {
  update (state, payload) {
    // todo: ensure paths end with /
    for (const key in payload) {
      if (state[key].default instanceof Array && typeof (payload[key].value) === 'string') {
        payload[key].value = payload[key].value.split(',')
      }
      this._vm.$set(state[key], 'value', payload[key].value) // todo: where is this._vm documented?
    }
  }
}
