import { ChainHttp, BlockHttp, NamespaceHttp, NamespaceId } from 'nem2-sdk'

export const state = () => ({
  blockHeight: null,
  currencyMosaicId: null,
  harvestMosaicId: null,
  generationHash: null
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
  },
  generationHash(state) {
    return state.generationHash
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
  },
  generationHash(state, { generationHash }) {
    state.generationHash = generationHash
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
    const chainHttp = new ChainHttp(endpoint)
    const blockHeight = (await chainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })
    const blockHttp = new BlockHttp(endpoint)
    const generationHash = (await blockHttp.getBlockByHeight(1).toPromise()).generationHash
    commit('generationHash', { generationHash })
  },
  async updateBlockHeight({ rootGetters, commit }) {
    const endpoint = rootGetters['wallet/endpoint']
    const chainHttp = new ChainHttp(endpoint)
    const blockHeight = (await chainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })
  }
}
