<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Current Multisig Graph
      v-card-text
        v-layout(column)
          span.subheading Cosignatories
          template(v-if="isMultisig")
            div(v-for="c in multisigAccountInfo.cosignatories" :key="c.address.plain()") {{ c.address.pretty() }}
          span(v-else) Not Multisig
      v-card-actions
        v-btn(
          @click="reload")
          v-icon cached
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
    }
  },
  computed: {
    ...mapGetters('wallet', {
      existsAccount: 'existsAccount',
      address: 'address',
      endpoint: 'endpoint'
    }),
    ...mapGetters('chain', [
      'multisigAccountGraphInfo',
      'multisigAccountInfo',
      'isMultisig'
    ])
  },
  methods: {
    reload: function (event) {
      this.$store.dispatch('chain/getMultisig', {
        endpoint: this.endpoint,
        address: this.address
      })
    }
  }
}
</script>

<style scoped>

</style>
