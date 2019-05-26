import { AccountHttp, BlockchainHttp, MosaicHttp, MosaicService, NamespaceHttp, NamespaceId, QueryParams } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export const state = () => ({
  blockHeight: null,
  currencyMosaicId: null,
  harvestMosaicId: null,
  mosaicAmountViews: [],
  namespaces: [],
  multisigAccountGraphInfo: null,
  multisigAccountInfo: null,
  isMultisig: null,
  properties: []
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
  },
  namespaces(state) {
    return state.namespaces
  },
  multisigAccountGraphInfo(state) {
    return state.multisigAccountGraphInfo
  },
  multisigAccountInfo(state) {
    return state.multisigAccountInfo
  },
  isMultisig(state) {
    return state.isMultisig
  },
  properties(state) {
    return state.properties
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
  },
  clearNamespaces(state) {
    state.namespaces = []
  },
  concatNamespaces(state, { namespaces }) {
    const oldVal = state.namespaces.slice()
    state.namespaces = oldVal.concat(namespaces)
  },
  clearMultisig(state) {
    state.multisigAccountGraphInfo = null
    state.multisigAccountInfo = null
    state.isMultisig = null
  },
  multisig(state, { multisigAccountGraphInfo, multisigAccountInfo, isMultisig }) {
    state.multisigAccountGraphInfo = multisigAccountGraphInfo
    state.multisigAccountInfo = multisigAccountInfo
    state.isMultisig = isMultisig
  },
  properties(state, { properties }) {
    state.properties = properties
  }
}

export const actions = {
  async init({ commit }, { endpoint, currencyNamespaceName, harvestNamespaceName }) {
    const namespaceHttp = new NamespaceHttp(endpoint)
    const currencyMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(currencyNamespaceName)).toPromise()
    const harvestMosaicId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(harvestNamespaceName)).toPromise()
    commit('init', { currencyMosaicId, harvestMosaicId })
  },
  async update({ commit }, { endpoint, address }) {
    const blockChainHttp = new BlockchainHttp(endpoint)
    const blockHeight = (await blockChainHttp.getBlockchainHeight().toPromise()).compact()
    commit('blockHeight', { blockHeight })

    commit('clearMosaicAmountView')
    const accountHttp = new AccountHttp(endpoint)
    const mosaicHttp = new MosaicHttp(endpoint)
    const mosaicService = new MosaicService(accountHttp, mosaicHttp)
    accountHttp.getAccountInfo(address).pipe(
      mergeMap((accountInfo) => {
        const mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [state.currencyMosaicId.createAbsolute(0), state.harvestMosaicId.createAbsolute(0)]
        return mosaicService.mosaicsAmountView(mosaics)
      })
    ).subscribe((mosaicAmountViews) => {
      commit('concatMosaicAmountViews', { mosaicAmountViews })
    }, () => {
    })

    function getNamespaces(namespaceHttp, address, query) {
      return new Promise((resolve, reject) => {
        const namespacesInfoTemporary = []
        namespaceHttp.getNamespacesFromAccount(address, query).pipe(
          mergeMap((namespacesInfo) => {
            namespacesInfo.map((x) => {
              namespacesInfoTemporary.push(x)
            })
            return namespaceHttp.getNamespacesName(namespacesInfo.map(x => x.id))
          })
        ).subscribe((namespacesName) => {
          const nameAndInfo = namespacesInfoTemporary.map((namespaceInfo) => {
            const namespaceName = namespacesName.find((namespaceName) => {
              return namespaceName.namespaceId.equals(namespaceInfo.id)
            })
            return {
              namespaceInfo,
              namespaceName
            }
          })
          resolve(nameAndInfo)
        }, (e) => {
          reject(e)
        })
      })
    }
    commit('clearNamespaces')
    const namespaceHttp = new NamespaceHttp(endpoint)
    let metaId
    for (let i = 0; i < 10; i++) {
      const namespaces = await getNamespaces(namespaceHttp, address, new QueryParams(10, metaId))
      if (namespaces.length > 0) {
        metaId = namespaces[namespaces.length - 1].namespaceInfo.metaId
        commit('concatNamespaces', { namespaces })
      } else {
        break
      }
    }

    commit('clearMultisig')
    const multisigAccountGraphInfo = accountHttp.getMultisigAccountGraphInfo(address).toPromise()
    const multisigAccountInfo = accountHttp.getMultisigAccountInfo(address).toPromise()
    const result = await Promise.all([multisigAccountGraphInfo, multisigAccountInfo])
    commit('multisig', {
      multisigAccountGraphInfo: result[0],
      multisigAccountInfo: result[1],
      isMultisig: result[1].length !== 0
    })

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
        const mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [state.currencyMosaicId.createAbsolute(0), state.harvestMosaicId.createAbsolute(0)]
        return mosaicService.mosaicsAmountView(mosaics)
      })
    ).subscribe((mosaicAmountViews) => {
      commit('concatMosaicAmountViews', { mosaicAmountViews })
    }, () => {
    })
  },
  async updateNamespaces({ state, commit }, { endpoint, address }) {
    function getNamespaces(namespaceHttp, address, query) {
      return new Promise((resolve, reject) => {
        const namespacesInfoTemporary = []
        namespaceHttp.getNamespacesFromAccount(address, query).pipe(
          mergeMap((namespacesInfo) => {
            namespacesInfo.map((x) => {
              namespacesInfoTemporary.push(x)
            })
            return namespaceHttp.getNamespacesName(namespacesInfo.map(x => x.id))
          })
        ).subscribe((namespacesName) => {
          const nameAndInfo = namespacesInfoTemporary.map((namespaceInfo) => {
            const namespaceName = namespacesName.find((namespaceName) => {
              return namespaceName.namespaceId.equals(namespaceInfo.id)
            })
            return {
              namespaceInfo,
              namespaceName
            }
          })
          resolve(nameAndInfo)
        }, (e) => {
          reject(e)
        })
      })
    }
    commit('clearNamespaces')
    const namespaceHttp = new NamespaceHttp(endpoint)
    let metaId
    for (let i = 0; i < 10; i++) {
      const namespaces = await getNamespaces(namespaceHttp, address, new QueryParams(10, metaId))
      if (namespaces.length > 0) {
        metaId = namespaces[namespaces.length - 1].namespaceInfo.metaId
        commit('concatNamespaces', { namespaces })
      } else {
        break
      }
    }
  },
  async getMultisig({ commit }, { endpoint, address }) {
    commit('clearMultisig')
    const accountHttp = new AccountHttp(endpoint)
    const multisigAccountGraphInfo = accountHttp.getMultisigAccountGraphInfo(address).toPromise()
    const multisigAccountInfo = accountHttp.getMultisigAccountInfo(address).toPromise()
    const result = await Promise.all([multisigAccountGraphInfo, multisigAccountInfo])
    commit('multisig', {
      multisigAccountGraphInfo: result[0],
      multisigAccountInfo: result[1],
      isMultisig: result[1].length !== 0
    })
  },
  async getProperties({ commit }, { endpoint, address }) {
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
