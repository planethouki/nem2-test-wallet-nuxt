import { AccountHttp } from 'nem2-sdk'

export const state = () => ({
  multisigAccountInfo: null
})

export const getters = {
  multisigAccountGraphInfo (state) {
    if (state.multisigAccountInfo === null) { return null }
    return state.multisigAccountInfo.multisigAccounts
  },
  multisigAccountInfo (state) {
    return state.multisigAccountInfo
  },
  isMultisig (state) {
    if (state.multisigAccountInfo === null) { return null }
    return state.multisigAccountInfo.isMultisig()
  },
  isCosigner (state) {
    if (state.multisigAccountInfo === null) { return null }
    return state.multisigAccountInfo.multisigAccounts.length !== 0
  }
}

export const mutations = {
  multisig (state, { multisigAccountInfo }) {
    state.multisigAccountInfo = multisigAccountInfo
  }
}

export const actions = {
  async update ({ commit, rootGetters }) {
    const endpoint = rootGetters['wallet/endpoint']
    const address = rootGetters['wallet/address']
    const accountHttp = new AccountHttp(endpoint)
    const multisigAccountInfo = await accountHttp.getMultisigAccountInfo(address).toPromise().catch(() => {
      return null
    })
    commit('multisig', {
      multisigAccountInfo
    })
  }
}
