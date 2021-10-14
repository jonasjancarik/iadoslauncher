/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false,
  target: 'static',
  head: {
    title: 'IADOS Launcher',
    meta: [{ charset: 'utf-8' }],
    link: [{ href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined', rel: 'stylesheet' }]
  },
  loading: false,
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false }
  ],
  buildModules: [
    // '@nuxtjs/google-fonts'
    '@nuxtjs/style-resources'
  ],
  modules: [
    // 'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],
  axios: {},
  components: true,
  css: [
    '@/assets/scss/main.scss'
  ],
  styleResources: {
    // https://stackoverflow.com/a/65085619/1334688,
    // https://rasaf-ibrahim.medium.com/way-to-add-bootstrap-5-with-nuxt-js-1f70e983514
    scss: [
      '~/node_modules/bootstrap/scss/_functions.scss',
      '~/node_modules/bootstrap/scss/_variables.scss',
      '~/node_modules/bootstrap/scss/_mixins.scss',
      '~/node_modules/bootstrap/scss/_containers.scss',
      '~/node_modules/bootstrap/scss/_grid.scss'
    ]
  }
  // googleFonts: {
  //   families: {
  //     'Material+Icons': true
  //   }
  // }
}
