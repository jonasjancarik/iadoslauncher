<template>
  <div class="default-template-wrapper vh-100 overflow-auto">
    <!--     <div id="top-bar" class="fixed-top px-3 pt-2">
      ...
    </div><!~~ /.wh-100 ~~> -->
    <div class="d-flex vh-100">
      <div class="menu-left">
        <div class="sticky-top d-flex justify-items-center flex-column h-100 px-1">
          <div class="d-flex flex-column align-items-center my-1 p-1 rounded text-wrap mb-5">
            <!-- <span :class="'material-icons-outlined ' + (hideBackButton ? 'visually-hidden' : '')" style="cursor: default; cursor: default;position: relative;left: -2px;" @click="$router.go(-1)">
              arrow_back
            </span> -->
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" :class="'bi bi-arrow-left-short ' + (hideBackButton ? 'visually-hidden' : '')" viewBox="0 0 16 16" @click="$router.go(-1)">
              <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
            </svg>
          </div>
          <nuxt-link to="/library" class="menu-item d-flex flex-column align-items-center my-1 p-1 rounded text-wrap">
            <!-- <span class="material-icons-outlined fs-3">
              search
            </span> -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <small class="small">Library</small>
          </nuxt-link>
          <nuxt-link to="/installed" class="menu-item d-flex flex-column align-items-center my-1 p-1 rounded text-wrap">
            <!-- <span class="material-icons-outlined fs-3">
              videogame_asset
            </span> -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-collection" viewBox="0 0 16 16">
              <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z" />
            </svg>
            <small class="small">Installed</small>
          </nuxt-link>
          <nuxt-link to="/settings" class="menu-item d-flex flex-column align-items-center mt-auto my-1 p-1 rounded text-wrap">
            <!-- <span class="material-icons-outlined fs-3">
              settings
            </span> -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
            </svg>
            <small class="small">Settings</small>
          </nuxt-link>
        </div><!-- /.sticky-top -->
      </div><!-- /.menu-left -->
      <div class="vh-100 d-flex flex-grow-1 justify-items-center flex-column">
        <div id="top-bar" class="px-3 d-flex justify-content-center">
          <input class="form-control w-25 m-1" placeholder="Search">
        </div>
        <div id="main-content" class="container-fluid overflow-auto rounded bg-white h-100">
          <!-- <app-header /> -->
          <nuxt />
        </div>
      </div>
    </div>
  </div><!-- /.default-template-wrapper -->
</template>

<script>
// import appHeader from '@/components/header'
export default {
  // components: { appHeader }
  computed: {
    hideBackButton () {
      // return this.$nuxt.context.from.path === '/'
      return false
    }
  }
}
</script>

<style>
body {
  background-color: rgb(237 237 241) !important;
  margin: 0 !important;
}
/* .menu-left, #top-bar {
} */
.menu-left a {
  /* color: initial; */
  text-decoration: initial;
  color: rgb(183, 183, 183) !important;
  transition: color ease 0.05s;
  transition: background-color ease 0.20s;
  cursor: default;
}

.menu-left [class^="material-icons-"] {
  color: rgb(121, 121, 121) !important;
}

.menu-left .nuxt-link-active {
  color: rgb(124, 124, 124) !important;
  background-color: rgb(247, 247, 247)
}

.menu-left a:hover {
  color: rgb(124, 124, 124) !important;
  background-color: rgb(224, 224, 224)
}

#main-content {
  box-shadow: inset 0 0 10px #bbbbbb;
}

.menu-left .menu-item svg {
  width: 1.2em
}

/* todo: link won't stay active if another is clicked anywhere else */
.menu-left .menu-item {
  border-left: 2px solid transparent
  /* to prevent 2px jump when no link is active */
  /* todo: make one link always active */
}

.menu-left .nuxt-link-active {
  border-left: 2px solid #0d6efd
}

</style>
