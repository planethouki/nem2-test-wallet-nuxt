<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Register Sub Namespace
      v-card-text
        div.d-flex
          v-text-field(
            label="Sub Namespace Name"
            v-model="s_name"
            required
            placeholder="ex). sub")
          v-text-field(
            label="Sub Namespace ID"
            :value="s_namespaceId"
            disabled).ml-2
        v-text-field(
          label="Parent Namespace"
          v-model="s_parentNamespace"
          required
          placeholder="ex). foo")
        v-text-field(
          label="Max Fee"
          v-model="s_fee"
          min="0"
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="s_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="s_history")
</template>

<script>
import { mapGetters } from 'vuex'
import { Deadline, TransactionHttp, NamespaceId, NamespaceRegistrationTransaction, UInt64 } from 'symbol-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'SubNamespace',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'subnamespace'
      }
    }
  },
  data () {
    return {
      s_name: 'bar',
      s_parentNamespace: 'foo',
      s_fee: 0,
      s_history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['feePlaceholder']),
    s_namespaceId () {
      try {
        return (new NamespaceId(`${this.s_parentNamespace}.${this.s_name}`)).toHex().toUpperCase()
      } catch (e) {
        return ''
      }
    }
  },
  mounted () {
    this.s_fee = this.feePlaceholder.default
  },
  methods: {
    s_announceHandler (event) {
      const namespaceName = this.s_name
      const parentNamespaceName = this.s_parentNamespace
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createSubNamespace(
        Deadline.create(),
        namespaceName,
        parentNamespaceName,
        account.address.networkType,
        UInt64.fromUint(this.s_fee)
      )
      const signedTx = account.sign(namespaceRegistrationTransaction, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transactionStatus/${signedTx.hash}`
      }
      this.s_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
