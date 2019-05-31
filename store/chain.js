import { BlockchainHttp, NamespaceHttp, NamespaceId } from 'nem2-sdk'

export const state = () => ({
  blockHeight: null,
  currencyMosaicId: null,
  harvestMosaicId: null
})

export const getters = {
  currencyMosaicId(state) {
    return state.currencyMosaicId
  },
  harvestMosaicId(state) {
    return state.harvestMosaicId
  },
  blockHeight(state) {
    return state.blockHeight
  }
}

export const mutations = {
  harvestMosaicId(state, { harvestMosaicId }) {
    state.harvestMosaicId = harvestMosaicId
  },
  currencyMosaicId(state, { currencyMosaicId }) {
    state.currencyMosaicId = currencyMosaicId
  },
  blockHeight(state, { blockHeight }) {
    state.blockHeight = blockHeight
  }
}

export const actions = {
  async init({ rootGetters, commit }) {
    const currencyNamespaceName = rootGetters['wallet/currencyNamespaceName']
    const harvestNamespaceName = rootGetters['wallet/harvestNamespaceName']
    const endpoint = rootGetters['wallet/endpoint']
    const namespaceHttp = new NamespaceHttp(endpoint)
    const currencyMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(currencyNamespaceName)).toPromise()
    commit('currencyMosaicId', { currencyMosaicId })
    const harvestMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(harvestNamespaceName)).toPromise()
    commit('harvestMosaicId', { harvestMosaicId })
    const blockChainHttp = new BlockchainHttp(endpoint)
    const blockHeight = (await blockChainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })
  },
  async updateBlockHeight({ rootGetters, commit }) {
    const endpoint = rootGetters['wallet/endpoint']
    const blockChainHttp = new BlockchainHttp(endpoint)
    const blockHeight = (await blockChainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })
  }
}
