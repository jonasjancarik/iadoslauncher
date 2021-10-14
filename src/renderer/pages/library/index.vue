<template>
  <div>
    <div id="games-list" class="row p-5">
      <div v-for="game in games" :key="game.identifier" class="col-12 col-md-4 col-xl-2 mb-4">
        <gameCard :game="game" />
      </div><!-- /.col -->
      <!--       <div class="w-100" />
      <div class="col" /><!~~ /.col ~~> -->
    </div><!-- /.row -->
    <div class="row">
      <div class="col d-flex justify-content-center">
        <nav>
          <ul v-if="totalPages > 0" class="pagination user-select-none">
            <li :class="'page-item ' + (page === 1 ? 'disabled' : '')">
              <!-- <nuxt-link class="page-link" :to="`/library?page=${page - 1}`">Previous</nuxt-link> -->
              <a class="page-link" @click="--page">Previous</a>
            </li>
            <template v-if="page <= 6">
              <li v-for="n in 9" :key="n" :class="'page-item ' + (n === page ? 'active' : '') ">
                <!-- <nuxt-link class="page-link" :to="`/library?page=${n}`">{{ n }}</nuxt-link> -->
                <a class="page-link" @click="page = n">{{ n }}</a>
              </li>
              <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
              <li class="page-item">
                <!-- <nuxt-link class="page-link" :to="`/library?page=${totalPages - 1}`">{{ totalPages - 1 }}</nuxt-link> -->
                <a class="page-link" @click="page = totalPages - 1">{{ totalPages - 1 }}</a>
              </li>
              <li class="page-item">
                <!-- <nuxt-link class="page-link" :to="`/library?page=${totalPages}`">{{ totalPages }}</nuxt-link> -->
                <a class="page-link" @click="page = totalPages">{{ totalPages }}</a>
              </li>
            </template>
            <template v-if="page > 6 && page < totalPages - 5">
              <li class="page-item">
                <!-- <nuxt-link class="page-link" href="/library?page=1">1</nuxt-link> -->
                <a class="page-link" @click="page = 1">1</a>
              </li>
              <li class="page-item">
                <!-- <nuxt-link class="page-link" href="/library?page=2">2</nuxt-link> -->
                <a class="page-link" @click="page = 2">2</a>
              </li>
              <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
              <li v-for="n in Array.from(new Array(9), (x, i) => i + (page - 6))" :key="n" :class="'page-item ' + (n - 4 + 6 === page ? 'active' : '') ">
                <!-- <nuxt-link class="page-link" :href="`/library?page=${ n - 4 + 6 }`">{{ n - 4 + 6 }}</nuxt-link> -->
                <a class="page-link" @click="page = n - 4 + 6">{{ n - 4 + 6 }}</a>
              </li>
              <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
              <li class="page-item">
                <!-- <a class="page-link" href="#">{{ totalPages - 1 }}</a> -->
                <a class="page-link" @click="page = totalPages - 1">{{ totalPages - 1 }}</a>
              </li>
              <li class="page-item">
                <!-- <a class="page-link" href="#">{{ totalPages }}</a> -->
                <a class="page-link" @click="page = totalPages">{{ totalPages }}</a>
              </li>
            </template>
            <template v-if="page >= totalPages - 5">
              <li class="page-item">
                <!-- <nuxt-link class="page-link" href="/library?page=1">1</nuxt-link> -->
                <a class="page-link" @click="page = 1">1</a>
              </li>
              <li class="page-item">
                <!-- <nuxt-link class="page-link" href="/library?page=2">2</nuxt-link> -->
                <a class="page-link" @click="page = 2">2</a>
              </li>
              <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
              <li v-for="n in Array.from(new Array(9), (x, i) => i + (totalPages - 8))" :key="n" :class="'page-item ' + (n === page ? 'active' : '') ">
                <!-- <nuxt-link class="page-link" :to="`/library?page=${n}`">{{ n }}</nuxt-link> -->
                <a class="page-link" @click="page = n">{{ n }}</a>
              </li>
            </template>
            <li :class="'page-item ' + (page === totalPages ? 'disabled' : '')">
              <!-- <nuxt-link class="page-link" :to="`/library?page=${page + 1}`">Next</nuxt-link> -->
              <a class="page-link" @click="++page">Next</a>
            </li>
          </ul>
        </nav>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div>
</template>

<script>
// import { remote } from 'electron'
// import SystemInformation from '@/components/SystemInformation.vue'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      rows: 18,
      // page: 1,
      totalPages: 0,
      games: []
    }
  },
  fetch () {
    console.log('fetch called')
    this.fetchGames()
  },
  computed: {
    page: {
      get () {
        return parseInt(this.$route.query.page) || 1
      },
      set (newValue) {
        this.$router.push({ path: this.$route.path, query: { page: newValue }, shallow: true })
      }
    }
  },
  watch: {
    page () {
      this.fetchGames()
    }
  },
  mounted () {
    console.log('index mounted')
  },
  methods: {
    ...mapMutations({
      addGame: 'games/add'
    }),
    async fetchGames () {
      // fetches games list
      const response = await this.$axios.$get(`https://archive.org/advancedsearch.php?q=collection:softwarelibrary_msdos_games&sort[]=downloads desc&fl[]=avg_rating&fl[]=creator&fl[]=downloads&fl[]=genre&fl[]=identifier&fl[]=item_size&fl[]=language&fl[]=name&fl[]=num_reviews&fl[]=oai_updatedate&fl[]=publicdate&fl[]=title&fl[]=type&fl[]=year&sort[]=&sort[]=&sort[]=&rows=${this.rows}&page=${this.page}&output=json`)
      console.log(response.responseHeader)
      this.games = response.response.docs
      this.totalResults = 0
      this.totalPages = Math.ceil(response.response.numFound / this.rows)
      response.response.docs.forEach(game => {
        // console.log(game.identifier)
        this.addGame(game)
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
    /* min-width: 10em; */
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
