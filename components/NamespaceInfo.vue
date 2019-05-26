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
      isNamespaceLoading: null,
      alert: ''
    }
  },
  computed: {
    ...mapGetters('wallet', {
      existsAccount: 'existsAccount',
      address: 'address',
      endpoint: 'endpoint'
    }),
    ...mapGetters('env', [
      'currencyNamespaceName',
      'harvestNamespaceName'
    ]),
    ...mapGetters('chain', [
      'blockHeight',
      'namespaces'
    ]),
    namespaceTexts() {
      const blockHeight = this.blockHeight
      const endpoint = this.endpoint
      if (this.isNamespaceLoading === false && this.namespaces.length === 0) {
        return [{ text: 'None', link: '' }]
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
