<template>
  <div>
    <div class="row p-5">
      <div class="col">
        <h1>Welcome!</h1>
        <p>
          Let's check a couple of things:
        </p>
        <div v-if="dosBoxFoundPath">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle text-success" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg> DOSBox installed
          </p>
          <p>DOSBox seems to be installed at {{ dosBoxFoundPath }} (you can change this later in the <nuxt-link to="/settings">settings</nuxt-link>)</p>
        </div>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div>
</template>

<script>
// import { remote } from 'electron'
import { exec } from 'child_process'
import { mapMutations } from 'vuex'
// import { ipcRenderer } from 'electron'
const fs = require('fs')

export default
{
  data () {
    return {
      settings: {},
      dosBoxFoundPath: null
    }
  },
  fetch () {
  },
  computed: {
    // settings () {
    //   return this.$store.state.settings
    // }
  },
  mounted () {
    this.loadSettings()
    this.checkDosBoxInstallation()
  },
  methods: {
    ...mapMutations({
      updateSettings: 'settings/update'
    }),
    loadSettings () {
      this.settings = JSON.parse(JSON.stringify(this.$store.state.settings))
    },
    saveSettings () {
      // save settings
      this.updateSettings(this.settings)
    },
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
            this.dosBoxFoundPath = dosboxdirs[dosboxdirs.length - 1] + '\\DOSBox.exe'
          }
        }
      } else {
        exec(`which ${this.settings.dosBoxExePath.value}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`)
            return
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
          }
          console.log(`stdout: ${stdout}`)
        })
      }
    }
  }
}
</script>

<style>

</style>
