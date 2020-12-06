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
  self: 'TCZ5KXKSAJA74A5ECZCXMHOHKFVQ36YSONW4RSA',
  alice: 'TAGX3ALCJEQZOKV2FAWAPPLY4KT2EYRUHBUZTFQ',
  bob: 'TDJBJZC5IS64DYZWSVXJGZVJHOVAGWGMWCBTN6Q',
  carol: 'TDUTG33ZLYL4GLL7KE7DMIOFBQMLF75DZB6FARI',
  dan: 'TC7ULQWT6A3Z6GTCMJUQSCD5G6YZNOVPVZ7UYPA'
}
const publicKeyPlaceholder = {
  alice: '143455C2FE35A07ADF7814128EAA9A0BA55849C8233442F48F60C02811A3C6B8',
  bob: 'AB106F067E10DADDA3D2739C8964FD3A6C90FCE1E213589DDB1A838045687483',
  carol: '1680F6071E93C036B192180E2E8C9050B6A30276D3B4433EBEA47ABAF75E1126',
  dan: '713FA4446275F62173186194F4FE898917BC2C05C9273E000461951A3557A255'
}
const privateKeyPlaceholder = {
  alice: 'F795C52F65E5AC4CDAF0CC4BC9F5427D11E6A9B003072C911C42CBE8912C57F7',
  bob: 'A3F49555E0C749A61D133D6E8ABC204AB6A3E5EC6B77C1087B1E85BCC5415914',
  carol: '1A5070493BD8D1D11D42AA8E628CB3E85EEF0C9F6689B2B7E60741516AF48900',
  dan: 'D3F7D6AD37D2F7380445ADB537181BB1C48D8294BA197AE1C14304736B442250'
}
const mosaicPlaceholder = {
  transfer: '@symbol.xym::0',
  transferAdd: '4A1B0170C0E51B73::0',
  currency10: '@symbol.xym::10000000',
  escrow1: '@symbol.xym::20000000',
  escrow2: '@symbol.xym::10000000',
  escrow3: '4A1B0170C0E51B73::0',
  restriction: '484CEFAE6A3F55CA',
  metadata: '56A65CC5E67ED980'
}
const namespacePlaceholder = {
  foo: '82A9D1AC587EC054'
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
  privateKeyPlaceholder,
  namespacePlaceholder,
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
  addressPlaceholder (state) {
    return state.addressPlaceholder
  },
  publicKeyPlaceholder (state) {
    return state.publicKeyPlaceholder
  },
  privateKeyPlaceholder (state) {
    return state.privateKeyPlaceholder
  },
  namespacePlaceholder (state) {
    return state.namespacePlaceholder
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
