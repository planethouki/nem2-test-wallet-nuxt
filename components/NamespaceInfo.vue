<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Owned Namespaces
          v-spacer
          small (max 100 namespaces)
      v-card-text
        v-layout(column)
          div(v-for="m in namespaceTexts" v-bind:key="m.link").ml-3
            div {{ m.text }}
              a.ml-2(:href="m.link" target="_blank" style="text-decoration:none;" v-if="m.link")
                v-icon(small) info
          span(v-if="namespaceTexts.length === 0 && isNamespaceLoading === false") None
      v-card-actions
        v-btn(
          :disabled="isNamespaceLoading"
          @click="reload")
          v-icon cached
        v-progress-circular(indeterminate v-if="isNamespaceLoading").ml-3
</template>

<script>
import { MosaicId, NamespaceHttp, BlockchainHttp, QueryParams } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export default {
  name: 'NamespaceInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'namespaceInfo'
      }
    }
  },
  data() {
    return {
      blockHeight: 0,
      isNamespaceLoading: true,
      alert: '',
      currencyMosaicId: new MosaicId('0000000000000000'),
      harvestMosaicId: new MosaicId('0000000000000000'),
      currencyNamespaceName: 'cat.currency',
      harvestNamespaceName: 'cat.harvest',
      namespaces: []
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    walletMutateCount() {
      return this.$store.getters['wallet/mutateCount']
    },
    address() {
      return this.$store.getters['wallet/address']
    },
    endpoint() {
      return this.$store.getters['wallet/endpoint']
    },
    namespaceTexts() {
      const blockHeight = this.blockHeight
      const endpoint = this.endpoint
      if (this.isNamespaceLoading === false && this.namespaces.length === 0) {
        return [{ text: 'none', link: '' }]
      }
      return this.namespaces.filter((ns, index, namespaces) => {
        for (let i = 0; i < index; i++) {
          if (ns === namespaces[i]) return false
        }
        return true
      }).sort(function (a, b) {
        const nameA = a.namespaceInfo.metaId
        const nameB = b.namespaceInfo.metaId
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      }).map((ns, index, original) => {
        const name = ns.namespaceInfo.levels.map(level => original.find(n => n.namespaceInfo.id.equals(level))).map(n => n.namespaceName.name).join('.')
        const hexId = ns.namespaceInfo.id.toHex().toUpperCase()
        const expireWithin = ns.namespaceInfo.endHeight.compact() - blockHeight
        const expireText = expireWithin > 0 ? `expire within ${expireWithin} blocks` : `expired ${-expireWithin} blocks ago`
        return {
          text: name + ', ' + hexId + ', ' + expireText,
          link: `${endpoint}/namespace/${hexId}`
        }
      })
    }
  },
  watch: {
    walletMutateCount: {
      handler: function () {
        this.reload()
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload: function () {
      if (!this.existsAccount) return
      this.reloadNamespaces()
    },
    reloadNamespaces: async function (event) {
      this.isNamespaceLoading = true
      this.blockHeight = 0
      const blockChainHttp = new BlockchainHttp(this.endpoint)
      this.blockHeight = (await blockChainHttp.getBlockchainHeight().toPromise()).compact()
      this.namespaces = []
      const namespaceHttp = new NamespaceHttp(this.endpoint)
      let metaId
      for (let i = 0; i < 10; i++) {
        const result = await this.getNamespaces(namespaceHttp, this.address, new QueryParams(10, metaId))
        if (result.length > 0) {
          metaId = result[result.length - 1].namespaceInfo.metaId
          result.map(x => this.namespaces.push(x))
        } else {
          break
        }
      }
      this.isNamespaceLoading = false
    },
    getNamespaces: function (namespaceHttp, address, query) {
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
  }
}
</script>

<style scoped>

</style>
