import { NamespaceHttp, QueryParams } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export const state = () => ({
  namespaces: null
})

export const getters = {
  namespaces (state) {
    return state.namespaces
  }
}

export const mutations = {
  initNamespaces (state) {
    state.namespaces = []
  },
  concatNamespaces (state, { namespaces }) {
    state.namespaces = state.namespaces.concat(namespaces)
  }
}

export const actions = {
  async update ({ commit, rootGetters }) {
    commit('initNamespaces')
    const endpoint = rootGetters['wallet/endpoint']
    const address = rootGetters['wallet/address']
    function getNamespaces (namespaceHttp, address, query) {
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
  }
}
