import { RepositoryFactoryHttp } from 'symbol-sdk'

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
    const repositoryFactoryHttp = new RepositoryFactoryHttp(endpoint)
    const chainHttp = repositoryFactoryHttp.createChainRepository()
    const blockHeight = (await chainHttp.getChainInfo().toPromise()).height.compact()
    commit('blockHeight', { blockHeight })
    const nodeHttp = repositoryFactoryHttp.createNodeRepository()
    const generationHash = (await nodeHttp.getNodeInfo().toPromise()).networkGenerationHashSeed
    commit('generationHash', { generationHash })
  },
  async updateBlockHeight ({ rootGetters, commit }) {
    const endpoint = rootGetters['wallet/endpoint']
    const repositoryFactoryHttp = new RepositoryFactoryHttp(endpoint)
    const chainHttp = repositoryFactoryHttp.createChainRepository()
    const blockHeight = (await chainHttp.getChainInfo().toPromise()).height.compact()
    commit('blockHeight', { blockHeight })
  }
}
