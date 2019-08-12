import { AccountHttp } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export const state = () => ({
  restrictions: null
})

export const getters = {
  restrictions (state) {
    return state.restrictions
  }
}

export const mutations = {
  restrictions (state, { restrictions }) {
    state.restrictions = restrictions
  }
}

export const actions = {
  async update ({ commit, rootGetters }) {
    const endpoint = rootGetters['wallet/endpoint']
    const address = rootGetters['wallet/address']
    const accountHttp = new AccountHttp(endpoint)
    const restrictions = await new Promise((resolve) => {
      accountHttp.getAccountInfo(address).pipe(
        mergeMap((accountInfo) => {
          return accountHttp.getAccountRestrictions(accountInfo.address)
        })
      ).subscribe((accountRestrictionsInfo) => {
        resolve(accountRestrictionsInfo.accountRestrictions.restrictions)
      }, () => {
        resolve([])
      })
    })
    commit('restrictions', { restrictions })
  }
}
