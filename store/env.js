import { NetworkType } from 'nem2-sdk'

export const state = () => ({
  endpointList: [
    { url: 'http://cow.48gh23s.xyz:3000', label: 'cow.48gh23s.xyz' }
  ],
  defaultEndpoint: 'http://cow.48gh23s.xyz:3000',
  defaultPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
  defaultNetworkType: NetworkType.MIJIN_TEST
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
  }
}
