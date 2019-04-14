import { Account, NetworkType } from 'nem2-sdk'

export const state = () => ({
  privateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
  endpoint: 'http://54.178.241.129:3000',
  networkType: NetworkType.MIJIN_TEST
})

export const getters = {
  getAddress(state) {
    return Account.createFromPrivateKey(state.privateKey, state.networkType).address
  },
  getPublicAccount(state) {
    return Account.createFromPrivateKey(state.privateKey, state.networkType).publicAccount
  },
  getAccount(state) {
    return Account.createFromPrivateKey(state.privateKey, state.networkType)
  }
}

export const mutations = {
  addAccount(state, account) {
    state.accounts.push(account)
  },
  removeAccount(state, { account }) {
    state.accounts.splice(state.account.indexOf(account), 1)
  },
  addEndpoint(state, endpoint) {
    state.endpoints.push(endpoint)
  },
  removeEndpoint(state, { endpoint }) {
    state.endpoints.splice(state.endpoints.indexOf(endpoint), 1)
  }
}
