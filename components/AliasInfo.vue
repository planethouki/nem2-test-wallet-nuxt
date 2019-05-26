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
          @click="reload")
          v-icon cached
</template>

<script>
import { mapGetters } from 'vuex'
import { UInt64, Address } from 'nem2-sdk'

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
      headers: [
        { text: 'Namespace', value: 'name' },
        { text: 'ID', value: 'hexId' },
        { text: 'Type', value: 'type' },
        { text: 'Alias', value: 'alias' }
      ]
    }
  },
  computed: {
    ...mapGetters('wallet', {
      existsAccount: 'existsAccount',
      address: 'address',
      endpoint: 'endpoint'
    }),
    ...mapGetters('chain', [
      'namespaces'
    ]),
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
  methods: {
    reload: async function (event) {
      this.isNamespaceLoading = true
      await this.$store.dispatch('chain/updateNamespaces', {
        endpoint: this.endpoint,
        address: this.address
      })
      this.isNamespaceLoading = false
    }
  }
}
</script>

<style scoped>

</style>
