const platformDefaults = {}

switch (require('os').platform()) {
case 'win32':
  platformDefaults.dosBoxExePath = 'C:\\Program Files (x86)\\DOSBox-0.74-3\\DOSBox.exe'
  platformDefaults.installDirPathBase = 'C:\\dos\\_iadoslauncher\\'
  platformDefaults.downloadDirPath = 'C:\\dos\\_iadoslauncher-temp\\'
  break

default:
  platformDefaults.dosBoxExePath = 'dosbox'
  platformDefaults.installDirPathBase = '~/iadoslauncher'
  platformDefaults.downloadDirPath = '~/iadoslauncher-temp'
  break
}

export const state = () => ({
  dosBoxExePath: {
    label: 'DOSBox Executable Path',
    description: 'Location of the DOSBox .exe file - on Mac OS and Linux this should probably be just "dosbox"',
    default: platformDefaults.dosBoxExePath,
    value: 'C:\\Program Files (x86)\\DOSBox-0.74-3\\DOSBox.exe'
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
    value: 'C:\\dos\\_iadoslauncher\\'
  },
  downloadDirPath: {
    label: 'Download directory',
    description: 'Path to the (temporary) directory to which the games are downloaded before being installed',
    default: platformDefaults.downloadDirPath,
    value: 'C:\\dos\\_iadoslauncher-temp\\'
  }
})

export const mutations = {
  update (state, payload) {
    for (const key in payload) {
      if (state[key].default instanceof Array && typeof (payload[key].value) === 'string') {
        payload[key].value = payload[key].value.split(',')
      }
      this._vm.$set(state[key], 'value', payload[key].value) // todo: where is this._vm documented?
    }
  }
}
