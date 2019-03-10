<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Register Sub Namespace
      v-card-text
        v-text-field(
          label="Sub Namespace Name"
          v-model="s_name"
          required
          placeholder="ex). sub")
        v-text-field(
          label="Parent Namespace"
          v-model="s_parentNamespace"
          required
          placeholder="ex). foo")
        v-text-field(
          label="Max Fee"
          v-model="s_fee")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="s_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="s_history")
</template>

<script>
import { Deadline, NamespaceType, TransactionHttp, RegisterNamespaceTransaction, UInt64 } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'SubNamespace',
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
      s_name: 'bar',
      s_parentNamespace: 'foo',
      s_fee: 0,
      s_history: []
    }
  },
  methods: {
    s_announceHandler: function (event) {
      const namespaceName = this.s_name
      const parentNamespaceName = this.s_parentNamespace
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const dummyRegisterNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
        Deadline.create(),
        namespaceName,
        parentNamespaceName,
        this.wallet.network
      )
      const registerNamespaceTransaction = new RegisterNamespaceTransaction(
        this.wallet.network,
        this.$TransactionVersion.REGISTER_NAMESPACE,
        Deadline.create(),
        UInt64.fromUint(this.s_fee),
        NamespaceType.SubNamespace,
        namespaceName,
        dummyRegisterNamespaceTransaction.namespaceId,
        undefined,
        dummyRegisterNamespaceTransaction.parentId
      )
      const signedTx = account.sign(registerNamespaceTransaction)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.s_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
