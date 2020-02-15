<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Register Namespace
      v-card-text
        div.d-flex
          v-text-field(
            label="Namespace Name"
            v-model="n_name"
            required
            placeholder="ex). foo")
          v-text-field(
            label="Namespace ID"
            :value="n_namespaceId"
            disabled).ml-2
        v-text-field(
          label="Duration In Blocks"
          v-model="n_duration"
          required
          min="0"
          type="number"
          placeholder="ex). 10")
        v-text-field(
          label="Max Fee"
          v-model="n_fee"
          min="0"
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="n_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="n_history")
</template>

<script>
import TxHistory from '../history/TxHistory.vue'
import { mapGetters } from 'vuex'
import { Deadline, UInt64, TransactionHttp, NamespaceId, NamespaceRegistrationTransaction } from 'nem2-sdk'

export default {
  name: 'Namespace',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'namespace'
      }
    }
  },
  data () {
    return {
      n_name: 'foo',
      n_duration: 180000,
      n_fee: 0,
      n_history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['feePlaceholder']),
    n_namespaceId () {
      try {
        return (new NamespaceId(this.n_name)).toHex().toUpperCase()
      } catch (e) {
        return ''
      }
    }
  },
  mounted () {
    this.n_fee = this.feePlaceholder.default
  },
  methods: {
    n_announceHandler (event) {
      const namespaceName = this.n_name
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createRootNamespace(
        Deadline.create(),
        namespaceName,
        UInt64.fromUint(this.n_duration),
        account.address.networkType,
        UInt64.fromUint(this.n_fee)
      )
      const signedTx = account.sign(namespaceRegistrationTransaction, this.generationHash)
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
