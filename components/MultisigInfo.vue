<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Current Multisig Graph
      v-card-text
        v-layout(column).mb-3
          span.subheading Cosignatories
          template(v-if="isMultisig")
            div(v-for="c in multisigAccountInfo.cosignatories" :key="c.publicKey") {{ c.publicKey }}
          span(v-else) Not Multisig
        v-layout(column)
          span.subheading Multisig Accounts
          template(v-if="isCosigner")
            div(v-for="c in multisigAccountGraphInfo" :key="c.publicKey") {{ c.publicKey }}
          span(v-else) Not Cosigner
      v-card-actions
        v-btn(
          @click="reload"
          :disabled="isLoading")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MultisigInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'multisigInfo'
      }
    }
  },
  data() {
    return {
      isLoading: null
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAddress']),
    ...mapGetters('multisigGraph', [
      'multisigAccountInfo',
      'multisigAccountGraphInfo',
      'isMultisig',
      'isCosigner'
    ])
  },
  methods: {
    reload: async function (event) {
      this.isLoading = true
      await this.$store.dispatch('multisigGraph/update')
      this.isLoading = false
    }
  }
}
</script>

<style scoped>

</style>
