<template>
  <div>
    <div class="row px-5 pt-5">
      <div class="col">
        <h1>Welcome!</h1>
        <p>
          Let's check a couple of things:
        </p>
        <div v-if="dosboxExePath">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle text-success" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg> DOSBox is installed in <code class="text-muted">{{ dosboxExePath }}</code>
          </p>
          <!-- todo: better wording on non-Win OSs -> "installed at" doesn't make a lot of sense for a command -->
        </div>
        <div v-else>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-danger" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
            DOSBox doesn't seem to be installed.
            <template v-if="packageManagerAvailable !== null">
              <template v-if="packageManagerAvailable">
                <button
                  class="btn btn-primary btn-sm"
                  :disabled="dosboxInstallRunning"
                  @click="tryInstallDosbox()"
                >
                  {{ dosboxInstallRunning ? 'Installing...' : 'Install DOSBox' }}
                </button><!-- /.btn btn-warning -->
                <span v-if="dosboxInstallFailed">
                  Installation failed. Try again or install DOSBox <a class="href" @click="openURL('https://www.dosbox.com/download.php?main=1')">manually</a>.
                </span>
              </template>
              <template v-else>
                <span>
                  Install <a class="href" @click="openURL('https://www.dosbox.com/download.php?main=1')">DOSBox</a> first.
                </span>
                <button class="btn btn-primary btn-small" @click="checkDosboxInstallPath">
                  Check again
                </button><!-- /.btn btn-primary btn-small -->
              </template>
            </template>
          </p>
        </div>
        <div v-if="Object.keys(settings).length">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle text-info" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            Games will be installed to <code class="text-muted">{{ settings.installDirPathBase.value }}</code>
          </p>
        </div>
      </div><!-- /.col -->
    </div><!-- /.row -->
    <div class="row px-5">
      <div class="col">
        <nuxt-link v-if="dosboxExePath" to="/library" class="btn btn-success">
          Good to go!
        </nuxt-link><!-- /.btn btn-primary -->
        <template v-else>
          <nuxt-link to="/library" class="btn btn-warning">
            Continue without DOSBox
          </nuxt-link><!-- /.btn btn-warning -->
          <p>
            <small class="small">
              You will be able to browse the library and open games in the browser, but you won't be able to save your progress or play offline. You can still install DOSBox later, though.
            </small><!-- /.small -->
          </p>
        </template>
      </div><!-- /.col -->
    </div><!-- /.row -->
    <div class="row px-5 pt-3">
      <div class="col">
        <nuxt-link to="/settings" class="btn btn-outline-primary">
          Change settings
        </nuxt-link><!-- /.btn btn-outline-primary -->
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
// import { ipcRenderer } from 'electron'

export default
{
  data () {
    return {
      settings: {},
      dosboxExePath: null,
      dosboxInstallRunning: false,
      dosboxInstallFailed: false,
      packageManagerAvailable: null
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
    // check DOSBox install and repeat every 2 seconds
    this.checkDosboxInstallPath()
    setInterval(() => {
      if (this.dosboxExePath === null) {
        this.checkDosboxInstallPath()
      }
    }, 2000)
    this.checkPackageManagerAvailability().then(available => {
      this.packageManagerAvailable = available
    })
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
    checkDosboxInstallPath () {
      this.dosboxExePath = this.getDosboxInstallPath()
    },
    async tryInstallDosbox () {
      this.dosboxInstallRunning = true
      try {
        await this.installDosbox()
        this.dosboxExePath = this.getDosboxInstallPath()
      } catch (e) {
        console.error(e)
        this.dosboxInstallFailed = true
      }
      this.dosboxInstallRunning = false
    }
  }
}
</script>

<style>
.href {
  cursor: pointer
}
</style>
