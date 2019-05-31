<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Owned Namespaces
          v-spacer
          small (max 100 namespaces)
      v-card-text
        v-layout(column)
          span(v-if="namespaces === null")
          span(v-else-if="namespaceTexts.length === 0 && !isLoading") None
          template(v-else)
            div(v-for="m in namespaceTexts" v-bind:key="m.link").ml-3
              div {{ m.text }}
                a.ml-2(:href="m.link" target="_blank" style="text-decoration:none;" v-if="m.link")
                  v-icon(small) info
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
      isLoading: null
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAddress'
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
        const expireText = `expire ${ns.namespaceInfo.endHeight.compact()}`
        return {
          text: name + ', ' + hexId + ', ' + expireText,
          link: `${endpoint}/namespace/${hexId}`
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
