<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Current Alias
          v-spacer
          small (max 100 namespaces)
      v-card-text
        v-data-table(
        :headers="headers"
        :items="namespaceTable"
        class="elevation-1")
          template(v-slot:items="props")
            td {{ props.item.name }}
            td {{ props.item.hexId }}
            td {{ props.item.type }}
            td {{ props.item.alias }}
      v-card-actions
        v-btn(
          @click="reloadAccount")
          v-icon cached
</template>

<script>
import { NamespaceHttp, UInt64, Address, QueryParams } from 'nem2-sdk'
import { mergeMap } from 'rxjs/operators'

export default {
  name: 'AliasInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'aliasInfo'
      }
    }
  },
  data() {
    return {
      namespaces: [],
      headers: [
        { text: 'Namespace', value: 'name' },
        { text: 'ID', value: 'hexId' },
        { text: 'Type', value: 'type' },
        { text: 'Alias', value: 'alias' }
      ]
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    endpoint() {
      return this.$store.getters['wallet/endpoint']
    },
    address() {
      return this.$store.getters['wallet/address']
    },
    walletMutateCount() {
      return this.$store.getters['wallet/mutateCount']
    },
    namespaceTable: function () {
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
        let aliasText
        let aliasType
        switch (ns.namespaceInfo.alias.type) {
          case 0:
            aliasText = 'no alias'
            aliasType = '-'
            break
          case 1:
            aliasText = (new UInt64(ns.namespaceInfo.alias.mosaicId)).toHex().toUpperCase()
            aliasType = 'mosaic'
            break
          case 2:
            aliasText = Address.createFromEncoded(ns.namespaceInfo.alias.address).plain()
            aliasType = 'address'
            break
        }
        return {
          name: ns.namespaceInfo.levels.map(level => original.find(n => n.namespaceInfo.id.equals(level))).map(n => n.namespaceName.name).join('.'),
          hexId: ns.namespaceInfo.id.toHex().toUpperCase(),
          type: aliasType,
          alias: aliasText
        }
      })
    }
  },
  watch: {
    walletMutateCount: {
      handler: function () {
        this.reloadAccount()
      }
    }
  },
  mounted() {
    this.reloadAccount()
  },
  methods: {
    reloadAccount: async function (event) {
      if (!this.existsAccount) return
      this.namespaces = []
      const address = this.address
      const endpoint = this.endpoint
      const namespaceHttp = new NamespaceHttp(endpoint)
      let metaId
      for (let i = 0; i < 10; i++) {
        const result = await this.getNamespaces(namespaceHttp, address, new QueryParams(10, metaId))
        if (result.length > 0) {
          metaId = result[result.length - 1].namespaceInfo.metaId
          result.map(x => this.namespaces.push(x))
        } else {
          break
        }
      }
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
