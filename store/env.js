import { NetworkType } from 'nem2-sdk'

let endpointList, defaultEndpoint, mosaicPlaceholder, feePlaceholder
if (process.env.isNf) {
  endpointList = [
    { url: 'http://103.3.60.174:3000', label: 'my-8' },
    { url: 'http://13.114.200.132:3000', label: 'jp-5' },
    { url: 'http://47.108.88.254:3000', label: 'cn-3' }
  ]
  defaultEndpoint = 'http://103.3.60.174:3000'
  mosaicPlaceholder = {
    transfer: '@nem.xem::0',
    currency10: '@nem.xem::10000000',
    escrow1: '@nem.xem::20000000',
    escrow2: '@nem.xem::10000000'
  }
  feePlaceholder = {
    default: 100000
  }
} else {
  endpointList = [
    { url: 'http://fushicho.48gh23s.xyz:3000', label: 'fushicho.48gh23s.xyz' }
  ]
  defaultEndpoint = 'http://fushicho.48gh23s.xyz:3000'
  mosaicPlaceholder = {
    transfer: '@cat.currency::0',
    currency10: '@cat.currency::10000000',
    escrow1: '@cat.currency::0',
    escrow2: '@cat.harvest::0'
  }
  feePlaceholder = {
    default: 100000
  }
}

export const state = () => ({
  endpointList,
  defaultEndpoint,
  defaultPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
  defaultNetworkType: NetworkType.MIJIN_TEST,
  isNf: process.env.isNf,
  mosaicPlaceholder,
  feePlaceholder
})

export const getters = {
  defaultEndpoint (state) {
    return state.defaultEndpoint
  },
  defaultPrivateKey (state) {
    return state.defaultPrivateKey
  },
  defaultNetworkType (state) {
    return state.defaultNetworkType
  },
  endpointList (state) {
    return state.endpointList
  },
  isNf (state) {
    return state.isNf
  },
  mosaicPlaceholder (state) {
    return state.mosaicPlaceholder
  },
  feePlaceholder (state) {
    return state.feePlaceholder
  }
}

export const mutations = {
  setDefaultPrivateKey (state, { privateKey }) {
    state.defaultPrivateKey = privateKey
  }
}

export const actions = {
  logout ({ commit }, { account }) {
    commit('setDefaultPrivateKey', { privateKey: account.privateKey })
  }
}
