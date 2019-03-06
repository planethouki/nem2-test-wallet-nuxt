<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Register Namespace
      v-card-text
        v-text-field(
          label="Namespace Name"
          v-model="n_name"
          required
          placeholder="ex). foo")
        v-text-field(
          label="Duration In Blocks"
          v-model="n_duration"
          required
          type="number"
          placeholder="ex). 10")
        v-text-field(
          label="Max Fee"
          v-model="n_fee")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="n_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="n_history")
</template>

<script>
import { Deadline, UInt64, NamespaceId, NamespaceType, TransactionHttp, RegisterNamespaceTransaction } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'Namespace',
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
      n_name: 'foo',
      n_duration: 60,
      n_fee: 0,
      n_history: []
    }
  },
  methods: {
    n_announceHandler: function (event) {
      const namespaceName = this.n_name
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const registerNamespaceTransaction = new RegisterNamespaceTransaction(
        this.wallet.network,
        this.$TransactionVersion.REGISTER_NAMESPACE,
        Deadline.create(),
        UInt64.fromUint(this.n_fee),
        NamespaceType.RootNamespace,
        namespaceName,
        new NamespaceId(namespaceName),
        UInt64.fromUint(this.n_duration)
      )
      const signedTx = account.sign(registerNamespaceTransaction)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.n_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
