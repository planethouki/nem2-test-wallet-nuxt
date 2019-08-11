const rp = require('request-promise-native')

export const state = () => ({
  linkedAccountKey: null
})

export const getters = {
  linkedAccountKey (state) {
    return state.linkedAccountKey
  }
}

export const mutations = {
  linkedAccountKey (state, { linkedAccountKey }) {
    state.linkedAccountKey = linkedAccountKey
  }
}

export const actions = {
  async update ({ commit, rootGetters }) {
    const endpoint = rootGetters['wallet/endpoint']
    const address = rootGetters['wallet/address']
    const linkedAccountKey = await rp(`${endpoint}/account/${address.plain()}`).then((response) => {
      const base64data = JSON.parse(response).account.linkedAccountKey
      return Buffer.from(base64data, 'base64').toString('hex').toUpperCase()
    }).catch((e) => {
      return '0000000000000000000000000000000000000000000000000000000000000000'
    })
    commit('linkedAccountKey', { linkedAccountKey })
  }
}
