export const state = () => ({
  showWelcome: true
})

export const mutations = {
  toggleShowWelcome (state) {
    state.showWelcome = !state.welcome
  }
}
