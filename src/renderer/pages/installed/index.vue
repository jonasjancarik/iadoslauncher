<template>
  <div>
    <div v-if="games.length" id="games-list" class="row row-cols-6 p-5">
      <div v-for="game in games" :key="game.identifier" class="col mb-4">
        <gameCard :game="game" />
      </div><!-- /.col -->
    </div><!-- /.row -->
    <div v-else class="row p-5">
      <div class="col">
        <p>
          No games found in the install directory ({{ settings.installDirPathBase.value }}).
        </p>
        <p>
          You can change the install directory location in the <nuxt-link to="/settings">settings</nuxt-link>.
        </p>
      </div>
      <!-- /.col -->
    </div><!-- /.row p-5 -->
  </div>
</template>

<script>
// import { remote } from 'electron'
// import SystemInformation from '@/components/SystemInformation.vue'
import { mapMutations } from 'vuex'
const fs = require('fs')

export default {
  data () {
    return {
      rows: 20,
      totalPages: 0,
      games: [],
      gamesInstalled: []
    }
  },
  fetch () {
    console.log('fetch called')
    this.fetchInstalledGames()
  },
  computed: {
    settings () {
      return this.$store.state.settings
    }
  },
  watch: {
    // page () {
    //   this.fetchGames()
    // }
  },
  mounted () {
    // console.log('index mounted')
    const vm = this
    this.gamesInstalled.forEach(identifier => {
      if (this.$store.state.games.games[identifier]) {
        this.games.push(this.$store.state.games.games[identifier])
      } else {
        console.log(identifier + ' not found in vuex')
        vm.fetchGameDetails(identifier)
          .then(() => {
            vm.games.push(this.$store.state.games.games[identifier])
          })
      }
    })
  },
  methods: {
    ...mapMutations({
      addGame: 'games/add'
    }),
    fetchInstalledGames () {
      fs.readdirSync(this.settings.installDirPathBase.value).forEach(file => {
        this.gamesInstalled.push(file)
      })
    },
    fetchGameDetails (identifier) {
      // eslint-disable-next-line no-new
      return new Promise((resolve, reject) => {
        // fetches games list
        const q = `collection:(softwarelibrary_msdos_games) AND identifier:(${identifier})`
        this.$axios.$get(`https://archive.org/advancedsearch.php?q=${q}&sort[]=downloads desc&fl[]=avg_rating&fl[]=creator&fl[]=downloads&fl[]=genre&fl[]=identifier&fl[]=item_size&fl[]=language&fl[]=name&fl[]=num_reviews&fl[]=oai_updatedate&fl[]=publicdate&fl[]=title&fl[]=type&fl[]=year&sort[]=&sort[]=&sort[]=&rows=${this.rows}&page=${this.page}&output=json`)
          .then(response => {
            console.log(response.responseHeader)
            response.response.docs.forEach(game => {
            // console.log(game.identifier)
              this.addGame(game)
            })
            resolve()
          })
          .catch(e => reject(e))
      })
    }
    // openURL (url) {
    //   remote.shell.openExternal(url)
    // }
  }
}
</script>

<style>
  .game-card {
    min-width: 10em;
    min-height: 17em;
    /* font-size: 1em; */
    top: 0px;
    transition: top ease 0.15s;
  }
  .game-card.bouncing:hover {
    top: -2px;
  }
  .game-card .card-title {
    font-size: 1em;
    /* margin-bottom: 0em; */
  }
  /* .game-card .card-subtitle {
    font-size: 0.8em
  } */
  /* .game-card .game-info {
    font-size: 0.8em
  } */
  .game-card [class^="material-icons-"] {
    font-size: 1.3em;
    top: 1px;
    position: relative;
  }
  .pagination a {
    cursor: default
  }
</style>
