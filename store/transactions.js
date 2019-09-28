export const state = () => ({
  unconfirmedTransactions: [],
  aggregateBondedTransactions: [],
  confirmedTransactions: []
})

export const getters = {
  unconfirmedTransactions (state) {
    return state.unconfirmedTransactions
  },
  aggregateBondedTransactions (state) {
    return state.aggregateBondedTransactions
  },
  confirmedTransactions (state) {
    return state.confirmedTransactions
  }
}

export const mutations = {
  unconfirmedTransactions (state, { unconfirmedTransactions }) {
    state.unconfirmedTransactions = unconfirmedTransactions
  },
  aggregateBondedTransactions (state, { aggregateBondedTransactions }) {
    state.aggregateBondedTransactions = aggregateBondedTransactions
  },
  confirmedTransactions (state, { confirmedTransactions }) {
    state.confirmedTransactions = confirmedTransactions
  }
}

export const actions = {
  unconfirmedAdded ({ state, commit }, { transaction }) {
    const unconfirmed = state.unconfirmedTransactions.slice()
    unconfirmed.push(transaction)
    commit('unconfirmedTransactions', { unconfirmedTransactions: unconfirmed })
  },
  unconfirmedRemoved ({ state, commit }, { transaction }) {
    const unconfirmed = state.unconfirmedTransactions.slice()
    const index = unconfirmed.findIndex((element) => {
      return transaction === element.transactionInfo.hash
    })
    if (index > -1) {
      unconfirmed.splice(index, 1)
    }
    commit('unconfirmedTransactions', { unconfirmedTransactions: unconfirmed })
  },
  aggregateBondedAdded ({ state, commit }, { transaction }) {
    const partial = state.aggregateBondedTransactions.slice()
    partial.push(transaction)
    commit('aggregateBondedTransactions', { aggregateBondedTransactions: partial })
  },
  aggregateBondedRemoved ({ state, commit }, { transaction }) {
    const partial = state.aggregateBondedTransactions.slice()
    const index = partial.findIndex((element) => {
      return transaction === element.transactionInfo.hash
    })
    if (index > -1) {
      partial.splice(index, 1)
    }
    commit('aggregateBondedTransactions', { aggregateBondedTransactions: partial })
  },
  confirmedAdded ({ state, commit }, { transaction }) {
    const confirmed = state.confirmedTransactions.slice()
    confirmed.splice(0, 0, transaction)
    commit('confirmedTransactions', { confirmedTransactions: confirmed })
  }
}
