import { NetworkType } from 'nem2-sdk'

export const state = () => ({
  endpointList: [
    { url: 'http://54.178.241.129:3000', label: 'cow (54.178.241.129)' },
    { url: 'http://13.114.36.139:3000', label: 'cow with fee (13.114.36.139)' }
  ],
  defaultEndpoint: 'http://54.178.241.129:3000',
  defaultPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
  defaultNetworkType: NetworkType.MIJIN_TEST,
  currencyNamespaceName: 'cat.currency',
  harvestNamespaceName: 'cat.harvest'
})

export const getters = {
  defaultEndpoint(state) {
    return state.defaultEndpoint
  },
  defaultPrivateKey(state) {
    return state.defaultPrivateKey
  },
  defaultNetworkType(state) {
    return state.defaultNetworkType
  },
  endpointList(state) {
    return state.endpointList
  },
  currencyNamespaceName(state) {
    return state.currencyNamespaceName
  },
  harvestNamespaceName(state) {
    return state.harvestNamespaceName
  }
}
