<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Persistent Delegation Request Transaction
      v-card-text
        v-text-field(
          label="Delegated Private Key"
          v-model="signingPrivateKey"
          required
          :placeholder="`ex). ${signingPrivateKey.bob}`")
        v-text-field(
          label="Node Public Key"
          v-model="nodePublicKey"
          required
          :placeholder="`ex). ${publicKeyPlaceholder.alice}`")
        v-text-field(
          label="VRF Private Key"
          v-model="vrfPrivateKey"
          required
          :placeholder="`ex). ${privateKeyPlaceholder.carol}`")
        v-text-field(
          label="Max Fee"
          type="number"
          min="0"
          v-model="fee")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="announceHandler") announce
      v-card-text
        tx-history(v-bind:history="history")
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, PersistentDelegationRequestTransaction,
  TransactionHttp
} from 'symbol-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'PersistentDelegationRequest',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'transfer'
      }
    }
  },
  data () {
    return {
      nodePublicKey: '',
      signingPrivateKey: '',
      vrfPrivateKey: '',
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAccount',
      'endpoint'
    ]),
    ...mapGetters('chain', [
      'generationHash'
    ]),
    ...mapGetters('env', [
      'accountPlaceholder',
      'publicKeyPlaceholder',
      'privateKeyPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.fee = this.feePlaceholder.default
    this.nodePublicKey = this.publicKeyPlaceholder.alice
    this.signingPrivateKey = this.privateKeyPlaceholder.bob
    this.vrfPrivateKey = this.privateKeyPlaceholder.carol
  },
  methods: {
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const tx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
        Deadline.create(),
        this.signingPrivateKey,
        this.vrfPrivateKey,
        this.nodePublicKey,
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(tx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transactionStatus/${signedTx.hash}`
      }
      this.history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
