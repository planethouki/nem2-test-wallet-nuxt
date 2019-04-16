<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-text
        v-layout(align-baseline)
          span.title Current Alias
          v-btn(
          fab
          small
          flat
          @click="reloadAccount")
            v-icon cached
          v-spacer
          small (max 10 namespaces)
        v-data-table(
        :headers="headers"
        :items="namespaceTable"
        class="elevation-1")
          template(v-slot:items="props")
            td {{ props.item.name }}
            td {{ props.item.hexId }}
            td {{ props.item.type }}
            td {{ props.item.alias }}
</template>

<script>
import { NamespaceHttp, UInt64, Address } from 'nem2-sdk'
import { flatMap, mergeMap } from 'rxjs/operators'

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
      return this.$store.getters['wallet/getEndpoint']
    },
    address() {
      return this.$store.getters['wallet/getAddress']
    },
    walletMutateCount() {
      return this.$store.getters['wallet/getMutateCount']
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
  methods: {
    reloadAccount: function (event) {
      if (!this.existsAccount) return
      const address = this.address
      const endpoint = this.endpoint
      this.namespaces = []
      const namespaces = {}
      const namespaceHttp = new NamespaceHttp(endpoint)
      namespaceHttp.getNamespacesFromAccount(address).pipe(
        flatMap(_ => _),
        mergeMap((x) => {
          namespaces[x.id.toHex().toUpperCase()] = { namespaceInfo: x }
          return namespaceHttp.getNamespacesName([x.id])
        }),
        flatMap(_ => _)
      ).subscribe((namespaceName) => {
        const namespace = namespaces[namespaceName.namespaceId.toHex().toUpperCase()]
        namespace.namespaceName = namespaceName
        this.namespaces.push(namespace)
      })
    }
  }
}
</script>

<style scoped>

</style>
