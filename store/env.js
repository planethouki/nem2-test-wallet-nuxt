import { NetworkType } from 'nem2-sdk'

let endpointList, defaultEndpoint, mosaicPlaceholder, feePlaceholder, addressPlaceholder, publicKeyPlaceholder
if (process.env.isNemXem) {
  endpointList = [
    { url: 'https://test-api.48gh23s.xyz:3001', label: 'https://test-api.48gh23s.xyz:3001' }
  ]
  defaultEndpoint = 'https://test-api.48gh23s.xyz:3001'
  addressPlaceholder = {
    alice: 'TD4ZKE-4P3HMB-M45K5O-3DMTIO-R4F5SZ-4CMFWG-PJZC',
    bob: 'TBQM77-CO6Y5B-XFPS4B-GR2WTM-ZYKBN4-MBKDBD-ZE43',
    carol: 'TCMT7B-HYMFIR-HR7YDT-HP22UP-WSVIRY-GY5CUZ-D5XE',
    dan: 'TCNYOV-4F7FHS-QVQAL2-Z5UJBY-A77BH5-RS2D7M-UV45'
  }
  publicKeyPlaceholder = {
    alice: 'A07DF97F445AC0540A85D37153276542735D216DB25930FC8F608410859A6D81',
    bob: '1BABB8BB3DA5CD948D040A1B25D5BB54803DFB63A1A8EB47AE7DCA03ED662817',
    carol: 'F09871E07C3B0EA836A2B32CD5690C42E2594B4DCFAB58AB83BB5799963EC88D',
    dan: 'DB23B23154133F1177FF52FEDC3463E94735FDD75BA8BC0B7BEEFC098C4116CC'
  }
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
    { url: 'http://localhost:3000', label: 'localhost' }
  ]
  defaultEndpoint = 'http://localhost:3000'
  addressPlaceholder = {
    alice: 'SBWEUW-ON6IBH-CW5IC4-EI6V6S-MTVJGC-JWGLF5-7UGK',
    bob: 'SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC',
    carol: 'SBNRDT-MZ3MF4-RFNQA2-ZA33G7-4EGTIN-CKX2EH-YYHY',
    dan: 'SCBCML-VDJBXA-RCOI6X-SKEU3E-R2L6HH-7UBEPT-ENGQ'
  }
  publicKeyPlaceholder = {
    alice: '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C',
    bob: '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57',
    carol: 'C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0',
    dan: '1C650F49DD67EC50BFDEA40906D32CDE3C969BDF58837C7DA320829BDDE96150'
  }
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
