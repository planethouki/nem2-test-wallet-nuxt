<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
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
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'subnamespace'
      }
    }
  },
  data() {
    return {
      s_name: 'bar',
      s_parentNamespace: 'foo',
      s_fee: 0,
      s_history: []
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    }
  },
  methods: {
    s_announceHandler: function (event) {
      const namespaceName = this.s_name
      const parentNamespaceName = this.s_parentNamespace
      const account = this.$store.getters['wallet/getAccount']
      const endpoint = this.$store.getters['wallet/getEndpoint']
      const dummyRegisterNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
        Deadline.create(),
        namespaceName,
        parentNamespaceName,
        account.address.networkType
      )
      const registerNamespaceTransaction = new RegisterNamespaceTransaction(
        account.address.networkType,
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
