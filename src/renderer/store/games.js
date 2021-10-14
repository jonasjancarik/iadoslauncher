// import Vue from vue

export const state = () => ({
  games: {}
})

export const mutations = {
  add (state, game) {
    // state.games[game.identifier] = game
    this._vm.$set(state.games, game.identifier, game)
  },
  remove (state, { identifier }) {
    delete state.games[identifier]
  },
  update (state, payload) {
    for (const key in payload.payload) {
      this._vm.$set(state.games[payload.identifier], key, payload.payload[key]) // todo: where is this._vm documented?
    }
  },
  toggle (state, todo) {
    todo.installed = !todo.installed
  }
}
