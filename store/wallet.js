import { Account } from 'nem2-sdk'

export const state = () => ({
  privateKey: null,
  endpoint: null,
  networkType: null,
  faucet: null,
  address: null,
  account: null,
  publicAccount: null,
  mutateCount: 0
})

export const getters = {
  getAddress(state) {
    return state.address
  },
  getPublicAccount(state) {
    return state.publicAccount
  },
  getAccount(state) {
    return state.account
  },
  getEndpoint(state) {
    return state.endpoint
  },
  getFaucet(state) {
    return state.faucet
  },
  existsAccount(state) {
    return state.privateKey !== null
  },
  getMutateCount(state) {
    return state.mutateCount
  }
}

export const mutations = {
  login(state, wallet) {
    state.faucet = wallet.faucet
    state.networkType = wallet.networkType
    state.endpoint = wallet.endpoint
    state.privateKey = wallet.privateKey
    const account = Account.createFromPrivateKey(wallet.privateKey, wallet.networkType)
    state.account = account
    state.publicAccount = account.publicAccount
    state.address = account.address
    state.mutateCount++
  },
  logout(state) {
    state.privateKey = null
    state.endpoint = null
    state.networkType = null
    state.faucet = null
    state.account = null
    state.publicAccount = null
    state.address = null
    state.mutateCount++
  }
}
