import { AccountHttp, MosaicHttp, MosaicService } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export const state = () => ({
  mosaicAmountViews: null
})

export const getters = {
  mosaicAmountViews(state) {
    return state.mosaicAmountViews
  }
}

export const mutations = {
  init(state) {
    state.mosaicAmountViews = []
  },
  concatMosaicAmountViews(state, { mosaicAmountViews }) {
    const oldVal = state.mosaicAmountViews.slice()
    state.mosaicAmountViews = oldVal.concat(mosaicAmountViews)
  }
}

export const actions = {
  update({ rootGetters, commit }) {
    commit('init')
    const endpoint = rootGetters['wallet/endpoint']
    const address = rootGetters['wallet/address']
    const accountHttp = new AccountHttp(endpoint)
    const mosaicHttp = new MosaicHttp(endpoint)
    const mosaicService = new MosaicService(accountHttp, mosaicHttp)
    accountHttp.getAccountInfo(address).pipe(
      mergeMap((accountInfo) => {
        const mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : []
        return mosaicService.mosaicsAmountView(mosaics)
      })
    ).subscribe((mosaicAmountViews) => {
      commit('concatMosaicAmountViews', { mosaicAmountViews })
    }, () => {
    })
  }
}
