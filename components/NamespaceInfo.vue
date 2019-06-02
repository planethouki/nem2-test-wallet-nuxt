<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Owned Namespaces
          v-spacer
          small (max 100 namespaces)
      v-card-text
        v-data-table(
          :headers="headers"
          :items="namespaceTexts")
          template(v-slot:items="props")
            td {{ props.item.name }}
            td
              a(:href="props.item.namespaceLink" target="_blank" style="text-decoration:none;" v-if="props.item.namespaceLink")
                span {{ props.item.hexId }}
            td
              a(:href="props.item.startHeightLink" target="_blank" style="text-decoration:none;" v-if="props.item.startHeightLink")
                span {{ props.item.startHeight }}
            td
              a(:href="props.item.endHeightLink" target="_blank" style="text-decoration:none;" v-if="props.item.endHeightLink")
                span {{ props.item.endHeight }}
            td {{ props.item.hasAlias }}
      v-card-actions
        v-btn(
          :disabled="isLoading"
          @click="reload")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3
</template>

<script>
import { mapGetters } from 'vuex'

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
      isLoading: null,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'ID', value: 'hexId' },
        { text: 'StartHeight', value: 'startHeight' },
        { text: 'EndHeight', value: 'endHeight' },
        { text: 'HasAlias', value: 'hasAlias' }
      ]
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAddress',
      'endpoint'
    ]),
    ...mapGetters('env', [
      'currencyNamespaceName',
      'harvestNamespaceName'
    ]),
    ...mapGetters('namespaces', [
      'namespaces'
    ]),
    namespaceTexts() {
      const endpoint = this.endpoint
      if (!this.isLoading && this.namespaces.length === 0) {
        return []
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
        return {
          hexId: hexId,
          name: name,
          startHeight: ns.namespaceInfo.startHeight.compact(),
          endHeight: ns.namespaceInfo.endHeight.compact(),
          hasAlias: ns.namespaceInfo.hasAlias(),
          namespaceLink: `${endpoint}/namespace/${hexId}`,
          startHeightLink: `${endpoint}/block/${ns.namespaceInfo.startHeight.compact()}`,
          endHeightLink: `${endpoint}/block/${ns.namespaceInfo.endHeight.compact()}`
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
