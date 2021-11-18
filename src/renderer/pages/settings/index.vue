<template>
  <div>
    <div class="row p-5">
      <div class="col">
        <h1>Settings</h1>
        <form>
          <div v-for="(option, key) in settings" :key="key" class="row mb-3">
            <div class="col-sm-4">
              <label for="inputEmail3" class="col col-form-label">{{ option.label }}</label>
              <p>
                <small>{{ option.description }}</small>
              </p>
              <div class="input-group">
                <input v-model="option.value" class="form-control">
                <button class="btn btn-outline-secondary" type="button" @click="option.value = option.default">Use default</button>
              </div>
            </div><!-- /.col-sm-4 -->
          </div>
          <button class="btn btn-primary" @click="saveSettings()">Save</button>
          <button class="btn btn-outline-primary" @click="loadSettings()">Discard changes</button>
        </form>
      </div><!-- /.col -->
    </div><!-- /.row -->
    <div class="row px-5">
      <div class="col">
        <button class="btn btn-danger" @click="clearLocalStorage()">
          Clear App Data
        </button><!-- /.btn btn-danger -->
        <small>Resets saved data ("localStorage"), incl. settings, within the app. Does not remove installed games.</small>
      </div><!-- /.col -->
    </div><!-- /.row -->
    <div class="row p-5">
      <div class="col">
        <system-information />
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div>
</template>

<script>
// import { remote } from 'electron'
// import SystemInformation from '@/components/SystemInformation.vue'
// import { exec } from 'child_process'
import { mapMutations } from 'vuex'
// import { ipcRenderer } from 'electron'
// const fs = require('fs')

export default
{
  data () {
    return {
      settings: {}
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
  },
  methods: {
    // todo: use this.checkDosBoxInstallPath() to detect DOSBox installation
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
    clearLocalStorage () {
      try {
        window.localStorage.removeItem('vuex')
        console.log('Local storage cleared')
      } catch (error) {
        console.log('Clearing local storage failed')
      }
    }
  }
}
</script>

<style>

</style>
