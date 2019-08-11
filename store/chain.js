import { ChainHttp, BlockHttp } from 'nem2-sdk'

export const state = () => ({
  blockHeight: null,
  generationHash: null
})

export const getters = {
  blockHeight (state) {
    return state.blockHeight
  },
  generationHash (state) {
    return state.generationHash
  }
}

export const mutations = {
  blockHeight (state, { blockHeight }) {
    state.blockHeight = blockHeight
  },
  generationHash (state, { generationHash }) {
    state.generationHash = generationHash
  }
}

export const actions = {
  async init ({ rootGetters, commit }) {
    const endpoint = rootGetters['wallet/endpoint']
    const chainHttp = new ChainHttp(endpoint)
    const blockHeight = (await chainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })
    const blockHttp = new BlockHttp(endpoint)
    const generationHash = (await blockHttp.getBlockByHeight(1).toPromise()).generationHash
    commit('generationHash', { generationHash })
  },
  async updateBlockHeight ({ rootGetters, commit }) {
    const endpoint = rootGetters['wallet/endpoint']
    const chainHttp = new ChainHttp(endpoint)
    const blockHeight = (await chainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })
  }
}
