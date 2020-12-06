import { Account, NetworkType, NetworkHttp } from 'symbol-sdk'
import { timeout } from 'rxjs/operators'

export const state = () => ({
  privateKey: null,
  endpoint: null,
  networkType: null,
  address: null,
  account: null,
  publicAccount: null,
  mutateCount: 0,
  currencyNamespaceName: process.env.currencyNamespaceName,
  harvestNamespaceName: process.env.harvestNamespaceName
})

export const getters = {
  address (state) {
    return state.address
  },
  publicAccount (state) {
    return state.publicAccount
  },
  account (state) {
    return state.account
  },
  endpoint (state) {
    return state.endpoint
  },
  existsAccount (state) {
    return state.account !== null
  },
  existsAddress (state) {
    return state.address !== null
  },
  mutateCount (state) {
    return state.mutateCount
  },
  networkType (state) {
    return state.networkType
  },
  currencyNamespaceName (state) {
    return state.currencyNamespaceName
  },
  harvestNamespaceName (state) {
    return state.harvestNamespaceName
  }
}

export const mutations = {
  login (state, { account, endpoint }) {
    state.networkType = account.address.networkType
    state.endpoint = endpoint
    state.privateKey = account.privateKey
    state.account = account
    state.publicAccount = account.publicAccount
    state.address = account.address
    state.mutateCount++
  },
  logout (state) {
    state.privateKey = null
    state.endpoint = null
    state.networkType = null
    state.account = null
    state.publicAccount = null
    state.address = null
    state.mutateCount++
  }
}

export const actions = {
  async privateKeyLogin ({ commit }, { privateKey, endpoint }) {
    const networkHttp = new NetworkHttp(endpoint)
    const networkType = await new Promise((resolve) => {
      networkHttp.getNetworkType().pipe(
        timeout(5000)
      ).subscribe((networkType) => {
        resolve(networkType)
      }, () => {
        resolve(NetworkType.MIJIN_TEST)
      })
    })
    const account = Account.createFromPrivateKey(privateKey, networkType)
    commit('login', { account, endpoint })
  },
  logout ({ commit }) {
    commit('logout')
  }
}
