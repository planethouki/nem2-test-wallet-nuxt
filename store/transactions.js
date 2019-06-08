import { AccountHttp, QueryParams } from 'nem2-sdk'

export const state = () => ({
  unconfirmedTransactions: null,
  aggregateBondedTransactions: null,
  confirmedTransactions: null
})

export const getters = {
  unconfirmedTransactions(state) {
    return state.unconfirmedTransactions
  },
  aggregateBondedTransactions(state) {
    return state.aggregateBondedTransactions
  },
  confirmedTransactions(state) {
    return state.confirmedTransactions
  }
}

export const mutations = {
  unconfirmedTransactions(state, { unconfirmedTransactions }) {
    state.unconfirmedTransactions = unconfirmedTransactions
  },
  aggregateBondedTransactions(state, { aggregateBondedTransactions }) {
    state.aggregateBondedTransactions = aggregateBondedTransactions
  },
  confirmedTransactions(state, { confirmedTransactions }) {
    state.confirmedTransactions = confirmedTransactions
  }
}

export const actions = {
  async update({ commit, rootGetters }) {
    const endpoint = rootGetters['wallet/endpoint']
    const publicAccount = rootGetters['wallet/publicAccount']
    const accountHttp = new AccountHttp(endpoint, publicAccount.address.networkType)
    const unconfirmedTransactions = await accountHttp.unconfirmedTransactions(publicAccount).toPromise()
    commit('unconfirmedTransactions', { unconfirmedTransactions })
    const aggregateBondedTransactions = await accountHttp.aggregateBondedTransactions(publicAccount).toPromise()
    commit('aggregateBondedTransactions', { aggregateBondedTransactions })
    const allConfirmedTransactions = []
    let metaId
    for (let i = 0; i < 10; i++) {
      const confirmedTransactions = await accountHttp.transactions(publicAccount, new QueryParams(10, metaId)).toPromise()
      if (confirmedTransactions.length > 0) {
        metaId = confirmedTransactions[confirmedTransactions.length - 1].transactionInfo.id
        allConfirmedTransactions.push(...confirmedTransactions)
      } else {
        break
      }
    }
    commit('confirmedTransactions', { confirmedTransactions: allConfirmedTransactions })
  },
  unconfirmedAdded({ state, commit }, { transaction }) {
    const unconfirmed = state.unconfirmedTransactions.slice()
    unconfirmed.push(transaction)
    commit('unconfirmedTransactions', { unconfirmedTransactions: unconfirmed })
  },
  unconfirmedRemoved({ state, commit }, { transaction }) {
    const unconfirmed = state.unconfirmedTransactions.slice()
    const index = unconfirmed.findIndex((element) => {
      return transaction === element.transactionInfo.hash
    })
    if (index > -1) {
      unconfirmed.splice(index, 1)
    }
    commit('unconfirmedTransactions', { unconfirmedTransactions: unconfirmed })
  },
  aggregateBondedAdded({ state, commit }, { transaction }) {
    const partial = state.aggregateBondedTransactions.slice()
    partial.push(transaction)
    commit('aggregateBondedTransactions', { aggregateBondedTransactions: partial })
  },
  aggregateBondedRemoved({ state, commit }, { transaction }) {
    const partial = state.aggregateBondedTransactions.slice()
    const index = partial.findIndex((element) => {
      return transaction === element.transactionInfo.hash
    })
    if (index > -1) {
      partial.splice(index, 1)
    }
    commit('aggregateBondedTransactions', { aggregateBondedTransactions: partial })
  },
  confirmedAdded({ state, commit }, { transaction }) {
    const confirmed = state.confirmedTransactions.slice()
    confirmed.push(transaction)
    commit('confirmedTransactions', { confirmedTransactions: confirmed })
  }
}
