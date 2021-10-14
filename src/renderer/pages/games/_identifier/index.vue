<template>
  <div id="game-detail" class="row p-5">
    <div class="col-3">
      <div class="card game-card shadow-sm mb-4 sticky-top">
        <img :src="'https://archive.org/services/img/' + game.identifier" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">{{ game.title }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">{{ game.year }} <stars :rating="game.avg_rating" :ratings-count="game.num_reviews" /></h6>
          <p class="card-text" /><p class="card-text">
            <small class="game-info small text-muted d-flex align-items-center">
              <span class="material-icons-outlined">visibility</span>&nbsp;{{ game.downloads.toLocaleString('en') }}×
            </small>
          </p>
          <button v-if="isInstalled" class="btn btn-primary" @click="play()">
            Play
          </button>
          <button v-else class="btn btn-primary" :disabled="isDownloading" @click="download()">
            <template v-if="!isDownloading">
              Install
            </template>
            <template v-else>
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Downloading...</span>
              </div>
              ({{ Math.ceil(downloadedSize / totalSize * 100) }}%)
            </template>
          </button>
        </div>
      </div>
    </div><!-- /.col -->
    <div v-if="metadataLoaded" class="col">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a :class="'nav-link ' + (showDescription ? 'active' : '')" aria-current="page" href="#" @click="showReviews = false; showDescription = true">Description</a>
        </li>
        <li class="nav-item">
          <a :class="'nav-link ' + (showReviews ? 'active' : '') + (game.metadata.reviews.length === 0 ? 'disabled' : '')" href="#" @click="showReviews = true; showDescription = false">Reviews ({{ game.metadata.reviews.length }})</a>
        </li>
      </ul>
      <div v-show="showDescription" id="description-wrapper" class="mt-3">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="game.metadata.metadata.description" />
      </div>
      <div v-show="showReviews" id="reviews-wrapper" class="mt-3">
        <div v-for="review in game.metadata.reviews" :key="review.createdate">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">{{ review.reviewtitle }}</h5>
              <h6 class="card-subtitle mb-2 text-muted"><stars :rating="Number(review.stars)" hide-rating /> | {{ review.reviewer }} | {{ review.reviewdate }}</h6>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="card-text"><p v-html="parseReviewBody(review.reviewbody)" /></div>
              <!-- <a href="#" class="card-link">Card link</a>
              <a href="#" class="card-link">Another link</a> -->
            </div>
          </div>
        </div>
      </div>
    </div><!-- /.col -->
  </div><!-- /.row -->
</template>

<script>
// import { remote } from 'electron'
// import SystemInformation from '@/components/SystemInformation.vue'
import { exec } from 'child_process'
import { mapMutations } from 'vuex'
import { ipcRenderer } from 'electron'
const fs = require('fs')

export default {
  data () {
    return {
      isDownloading: false,
      isInstalled: false,
      downloadedSize: 0,
      totalSize: 1,
      showDescription: true,
      showReviews: false
    }
  },
  fetch () {
    if (!this.game.metadata) {
      console.log('missing metadata, fetching...')
      this.fetchGameDetails(this.$route.params.identifier)
      this.checkIfInstalled(this.$route.params.identifier)
    }
  },
  computed: {
    game () {
      return this.$store.state.games.games[this.$route.params.identifier]
    },
    metadataLoaded () {
      return this.game && Object.prototype.hasOwnProperty.call(this.game, 'metadata') && Object.keys(this.game.metadata).length > 0 // todo: is there a more simple way?
    },
    settings () {
      return this.$store.state.settings
    }
  },
  mounted () {
    console.log('game details page mounted')
    this.checkIfInstalled(this.$route.params.identifier)
  },
  methods: {
    ...mapMutations({
      addGameInfo: 'games/add',
      updateGameInfo: 'games/update'
    }),
    async fetchGameDetails (identifier) {
      console.log('fetching game details')
      const response = await this.$axios.$get(`https://archive.org/metadata/${identifier}`)
      // this.$set(this.game, 'metadata', response)
      this.updateGameInfo({ identifier, payload: { metadata: response } })
    },
    checkIfInstalled (identifier) {
      this.isInstalled = fs.existsSync(this.settings.installDirPathBase.value + identifier)
    },
    download () {
      // get file name
      let fileName = null

      this.game.metadata.files.forEach(file => {
        if (file.format === 'ZIP') { // todo: what if multiple zips exist?
          fileName = file.name // no need to continue loop
        }
      })

      const path = this.settings.downloadDirPath.value
      const filePath = this.settings.downloadDirPath.value + fileName

      // check folder
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
        // delete file if exists
      } else if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      const vm = this

      vm.isDownloading = true
      const downloadURL = `https://archive.org/download/${this.game.identifier}/${fileName}`
      console.log(downloadURL)

      ipcRenderer.send('downloadFile', {
        item: { downloadURL },
        filePath
      })

      ipcRenderer.on('downloadProgress', (event, progressEvent) => {
        vm.totalSize = parseInt(progressEvent.total)
        vm.downloadedSize = progressEvent.loaded
      })

      ipcRenderer.on('downloadEnd', () => {
        ipcRenderer.removeAllListeners('downloadEnd')
        ipcRenderer.removeAllListeners('downloadProgress')
        ipcRenderer.removeAllListeners('downloadError')
        vm.isDownloading = false
        vm.totalSize = 1
        vm.downloadedSize = 0
        console.log('File downloaded.')
        this.install(filePath)
        return filePath
      })

      ipcRenderer.on('downloadError', (event, error) => {
        ipcRenderer.removeAllListeners('downloadEnd')
        ipcRenderer.removeAllListeners('downloadProgress')
        ipcRenderer.removeAllListeners('downloadError')
        console.log(error)
        // reject(error)
      })
    },
    install (filePath) { // install = unzipping downloaded file
      ipcRenderer.send('installGame', {
        filePath,
        installDirPathBase: this.settings.installDirPathBase.value,
        identifier: this.game.identifier
      })
      ipcRenderer.on('installEnd', () => {
        this.isInstalled = true
        ipcRenderer.removeAllListeners('installEnd')
      })
      ipcRenderer.on('installError', (event, error) => {
        this.isInstalled = false
        ipcRenderer.removeAllListeners('installEnd')
        console.log(error)
      })
    },
    play () {
      let cmd = ''
      if (require('os').platform() === 'win32') {
        cmd = `"${this.settings.dosBoxExePath.value}" "${this.settings.installDirPathBase.value}${this.game.identifier}\\${this.game.metadata.metadata.emulator_start.replace('/', '\\')}" ${this.settings.dosBoxFlags.value.join(' ')}`
      } else {
        cmd = `"${this.settings.dosBoxExePath.value}" "${this.settings.installDirPathBase.value}${this.game.identifier}/${this.game.metadata.metadata.emulator_start}" ${this.settings.dosBoxFlags.value.join(' ')}`
      }
      console.log(cmd)
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
        }
        console.log(`stdout: ${stdout}`)
      }
      )
    },
    parseReviewBody (reviewbody) {
      return '<p>' + reviewbody.replace('\n', '</p><p>') + '</p>'
    }
  }
}
</script>

<style>

</style>
