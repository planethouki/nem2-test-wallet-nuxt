<template lang="pug">
  v-flex(mb-5 v-if="address" v-bind:id="navTargetId")
    v-card
      v-card-title
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
</template>

<script>
import { NamespaceHttp, UInt64, Address } from 'nem2-sdk'
import { flatMap, mergeMap } from 'rxjs/operators'

export default {
  name: 'AliasInfo',
  props: [
    'endpoint',
    'address',
    'navTargetId'
  ],
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
    namespaceTable: function () {
      return this.namespaces.map((ns) => {
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
          name: ns.namespaceName.name,
          hexId: ns.namespaceInfo.id.toHex().toUpperCase(),
          type: aliasType,
          alias: aliasText
        }
      })
    }
  },
  watch: {
    address: {
      handler: function () {
        if (this.address) {
          this.reloadAccount()
        }
      }
    }
  },
  methods: {
    reloadAccount: function (event) {
      this.namespaces = []
      const namespaces = {}
      const namespaceHttp = new NamespaceHttp(this.endpoint)
      namespaceHttp.getNamespacesFromAccount(this.address).pipe(
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
