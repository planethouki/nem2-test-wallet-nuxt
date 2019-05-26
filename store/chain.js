import { AccountHttp, BlockchainHttp, MosaicHttp, MosaicService, NamespaceHttp, NamespaceId } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export const state = () => ({
  blockHeight: null,
  currencyMosaicId: null,
  harvestMosaicId: null,
  mosaicAmountViews: []
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
  mosaicAmountViews(state) {
    return state.mosaicAmountViews
  }
}

export const mutations = {
  init(state, { currencyMosaicId, harvestMosaicId }) {
    state.currencyMosaicId = currencyMosaicId
    state.harvestMosaicId = harvestMosaicId
  },
  blockHeight(state, { blockHeight }) {
    state.blockHeight = blockHeight
  },
  clearMosaicAmountView(state) {
    state.mosaicAmountViews = []
  },
  concatMosaicAmountViews(state, { mosaicAmountViews }) {
    const oldVal = state.mosaicAmountViews.slice()
    state.mosaicAmountViews = oldVal.concat(mosaicAmountViews)
  }
}

export const actions = {
  async init({ commit }, { endpoint, currencyNamespaceName, harvestNamespaceName }) {
    const namespaceHttp = new NamespaceHttp(endpoint)
    const currencyMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(currencyNamespaceName)).toPromise()
    const harvestMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(harvestNamespaceName)).toPromise()
    commit('init', { currencyMosaicId, harvestMosaicId })
  },
  async updateBlockHeight({ commit }, { endpoint }) {
    const blockChainHttp = new BlockchainHttp(endpoint)
    const blockHeight = (await blockChainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })
  },
  updateMosaicAmountVies({ state, commit }, { endpoint, address }) {
    commit('clearMosaicAmountView')
    const accountHttp = new AccountHttp(endpoint)
    const mosaicHttp = new MosaicHttp(endpoint)
    const mosaicService = new MosaicService(accountHttp, mosaicHttp)
    accountHttp.getAccountInfo(address).pipe(
      mergeMap((accountInfo) => {
        const mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [state.currencyMosaicId.createAbsolute(0)]
        return mosaicService.mosaicsAmountView(mosaics)
      })
    ).subscribe((mosaicAmountViews) => {
      commit('concatMosaicAmountViews', { mosaicAmountViews })
    }, () => {
    })
  }
}
