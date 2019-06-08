<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Current Alias
          v-spacer
          small (max 100 namespaces)
      v-card-text
        v-data-table(
        :headers="headers"
        :items="namespaceTable")
          template(v-slot:items="props")
            td {{ props.item.name }}
            td {{ props.item.hexId }}
            td {{ props.item.type }}
            td {{ props.item.alias }}
      v-card-actions
        v-btn(
          @click="reload"
          :disabled="isLoading")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3
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
        { text: 'NamespaceName', value: 'name' },
        { text: 'NamespaceID', value: 'hexId' },
        { text: 'AliasType', value: 'type' },
        { text: 'Alias', value: 'alias' }
      ],
      isLoading: null
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAddress']),
    ...mapGetters('namespaces', [
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
      this.isLoading = true
      await this.$store.dispatch('namespaces/update')
      this.isLoading = false
    }
  }
}
</script>

<style scoped>

</style>
