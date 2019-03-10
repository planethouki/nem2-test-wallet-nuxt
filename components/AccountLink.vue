<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Link (Not yet)
      v-card-text
        v-radio-group(label="Link Type" row)
          v-radio(label="Link")
          v-radio(label="Unlink")
        v-text-field(
          label="Remote Account Public Key"
          v-model="remoteAccountKey")
        v-text-field(
          label="Max Fee"
          v-model="fee")
      v-card-text
        tx-history(v-bind:history="history")
</template>

<script>
import { Account } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'AccountLink',
  components: {
    TxHistory
  },
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId'
  ],
  data() {
    return {
      remoteAccountKey: '',
      fee: 0,
      history: []
    }
  },
  mounted: function () {
    this.remoteAccountKey = Account.generateNewAccount(this.wallet.network).publicKey
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
