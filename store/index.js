export const state = () => ({
  drawer: null
})

export const getters = {
  drawer(state) {
    return state.drawer
  }
}

export const mutations = {
  toggleDrawer(state) {
    state.drawer = !state.drawer
  },
  setDrawer(state, value) {
    state.drawer = value
  }
}
