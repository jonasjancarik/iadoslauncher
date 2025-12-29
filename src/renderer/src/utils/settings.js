const os = window.require('os')

const platformDefaults = () => {
  const platform = os.platform()
  const homedir = os.homedir()
  const tempdir = os.tmpdir()

  switch (platform) {
  case 'win32':
    return {
      dosBoxExePath: 'C:\\Program Files (x86)\\DOSBox-0.74-3\\DOSBox.exe',
      installDirPathBase: `${homedir}\\AppData\\Local\\IADOS Launcher\\games\\`,
      downloadDirPath: `${tempdir}\\IADOS Launcher\\`
    }
  case 'darwin':
    return {
      dosBoxExePath: '/Applications/DOSBox.app/Contents/MacOS/DOSBox',
      installDirPathBase: `${homedir}/Library/Application Support/IADOS Launcher/games/`,
      downloadDirPath: `${tempdir}/IADOS Launcher/`
    }
  default:
    return {
      dosBoxExePath: 'dosbox',
      installDirPathBase: `${homedir}/.iadoslauncher/games/`,
      downloadDirPath: '/tmp/iadoslauncher/'
    }
  }
}

export const buildDefaultSettings = () => {
  const defaults = platformDefaults()
  return {
    dosBoxExePath: {
      label: 'DOSBox Executable Path',
      description:
        'Location of the DOSBox .exe file - on Mac OS and Linux this should probably be just "dosbox"',
      default: defaults.dosBoxExePath,
      value: defaults.dosBoxExePath
    },
    dosBoxFlags: {
      label: 'DOSBox command line parameters',
      description:
        'These parameters are used to specify options for running the game - see https://www.dosbox.com/wiki/Usage#Command_Line_Parameters',
      default: ['-noconsole', '-aspect'],
      value: ['-noconsole', '-aspect']
    },
    installDirPathBase: {
      label: 'Installation directory',
      description: 'Directory in which games installed by this app are stored',
      default: defaults.installDirPathBase,
      value: defaults.installDirPathBase
    },
    downloadDirPath: {
      label: 'Download directory',
      description:
        'Path to the (temporary) directory to which the games are downloaded before being installed',
      default: defaults.downloadDirPath,
      value: defaults.downloadDirPath
    }
  }
}
