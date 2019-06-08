import { AccountHttp } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export const state = () => ({
  properties: null
})

export const getters = {
  properties(state) {
    return state.properties
  }
}

export const mutations = {
  properties(state, { properties }) {
    state.properties = properties
  }
}

export const actions = {
  async update({ commit, rootGetters }) {
    const endpoint = rootGetters['wallet/endpoint']
    const address = rootGetters['wallet/address']
    const accountHttp = new AccountHttp(endpoint)
    const properties = await new Promise((resolve) => {
      accountHttp.getAccountInfo(address).pipe(
        mergeMap((accountInfo) => {
          return accountHttp.getAccountProperty(accountInfo.publicAccount)
        })
      ).subscribe((accountPropertiesInfo) => {
        resolve(accountPropertiesInfo.accountProperties.properties)
      }, () => {
        resolve([])
      })
    })
    commit('properties', { properties })
  }
}
