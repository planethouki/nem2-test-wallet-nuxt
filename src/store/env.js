import { NetworkType } from 'symbol-sdk'

const defaultPrivateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
const mileStone = 'Fushicho4'

const endpointList = [
  { url: 'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000', label: 'ap-northeast-1' },
  { url: 'http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000', label: 'ap-southeast-1' },
  { url: 'http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000', label: 'eu-central-1' },
  { url: 'http://api-01.eu-west-1.0.10.0.x.symboldev.network:3000', label: 'eu-west-1' },
  { url: 'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000', label: 'us-east-1' },
  { url: 'http://api-01.us-west-1.0.10.0.x.symboldev.network:3000', label: 'us-west-1' }
]
const defaultEndpoint = 'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000'
const defaultNetworkType = NetworkType.TEST_NET
const addressPlaceholder = {
  alice: 'TD4ZKE-4P3HMB-M45K5O-3DMTIO-R4F5SZ-4CMFWG-PJZC',
  bob: 'TBQM77-CO6Y5B-XFPS4B-GR2WTM-ZYKBN4-MBKDBD-ZE43',
  carol: 'TCMT7B-HYMFIR-HR7YDT-HP22UP-WSVIRY-GY5CUZ-D5XE',
  dan: 'TCNYOV-4F7FHS-QVQAL2-Z5UJBY-A77BH5-RS2D7M-UV45'
}
const publicKeyPlaceholder = {
  alice: 'A07DF97F445AC0540A85D37153276542735D216DB25930FC8F608410859A6D81',
  bob: '1BABB8BB3DA5CD948D040A1B25D5BB54803DFB63A1A8EB47AE7DCA03ED662817',
  carol: 'F09871E07C3B0EA836A2B32CD5690C42E2594B4DCFAB58AB83BB5799963EC88D',
  dan: 'DB23B23154133F1177FF52FEDC3463E94735FDD75BA8BC0B7BEEFC098C4116CC'
}
const mosaicPlaceholder = {
  transfer: '@symbol.xym::0',
  currency10: '@symbol.xym::10000000',
  escrow1: '@symbol.xym::20000000',
  escrow2: '@symbol.xym::10000000'
}
const feePlaceholder = {
  default: 100000
}

export const state = () => ({
  endpointList,
  defaultEndpoint,
  defaultPrivateKey,
  defaultNetworkType,
  mileStone,
  addressPlaceholder,
  publicKeyPlaceholder,
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
  mileStone (state) {
    return state.mileStone
  },
  endpointList (state) {
    return state.endpointList
  },
  isNemXem (state) {
    return state.isNemXem
  },
  addressPlaceholder (state) {
    return state.addressPlaceholder
  },
  publicKeyPlaceholder (state) {
    return state.publicKeyPlaceholder
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
