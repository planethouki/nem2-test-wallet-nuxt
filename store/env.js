import { NetworkType } from 'nem2-sdk'

let endpointList
let defaultEndpoint
if (process.env.isNf) {
  endpointList = [
    { url: 'http://13.114.200.132:3000', label: 'jp-5' }
  ]
  defaultEndpoint = 'http://13.114.200.132:3000'
} else {
  endpointList = [
    { url: 'http://elephant.48gh23s.xyz:3000', label: 'elephant.48gh23s.xyz' }
  ]
  defaultEndpoint = 'http://elephant.48gh23s.xyz:3000'
}

export const state = () => ({
  endpointList,
  defaultEndpoint,
  defaultPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
  defaultNetworkType: NetworkType.MIJIN_TEST,
  isNf: process.env.isNf
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
  isNf(state) {
    return state.isNf
  }
}
