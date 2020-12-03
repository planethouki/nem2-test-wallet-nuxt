<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Secret Proof Transaction
      v-card-text
        v-radio-group(label="Hash Type" v-model="p_hashType" row)
          v-radio(
          v-for="ht in p_hashTypes"
          :key="ht.type"
          :label="ht.label"
          :value="ht.type")
        .d-flex.align-baseline
          v-text-field(
            label="Proof (Hex)"
            v-model="p_proof"
            required
            counter
            placeholder="ex). 095B4FCD1F88F1785E59")
          v-btn(
            icon
            v-on:click="p_regenProof")
            v-icon cached
        v-text-field(
          label="Secret"
          v-model="p_secret"
          disabled)
        v-text-field(
          label="Recipient"
          v-model="p_recipient"
          required
          placeholder="ex). SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC or @alice")
        v-text-field(
          label="Max Fee"
          v-model="p_fee"
          required
          min="0"
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="p_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="p_history")
</template>

<script>
import { mapGetters } from 'vuex'
import { Deadline, SecretProofTransaction, LockHashAlgorithm, UInt64, TransactionHttp } from 'symbol-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'SecretProof',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'secretproof'
      }
    }
  },
  data () {
    return {
      p_hashType: 0,
      p_hashTypes: [
        { type: LockHashAlgorithm.Op_Sha3_256, label: 'Sha3-256' },
        { type: LockHashAlgorithm.Op_Hash_256, label: 'Hash256' },
        { type: LockHashAlgorithm.Op_Hash_160, label: 'Hash160' }
      ],
      p_proof: '',
      p_recipient: '',
      p_fee: 0,
      p_history: []
    }
  },
  computed: {
    p_secret () {
      switch (this.p_hashType) {
        case LockHashAlgorithm.Op_Sha3_256:
          return this.$hash.sha3(this.p_proof)
        case LockHashAlgorithm.Op_Hash_256:
          return this.$hash.hash256(this.p_proof)
        case LockHashAlgorithm.Op_Hash_160:
          return this.$hash.hash160(this.p_proof)
        default:
          return 'error'
      }
    },
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['addressPlaceholder', 'feePlaceholder'])
  },
  created () {
    this.p_proof = this.$crypto.random20()
  },
  mounted () {
    this.p_fee = this.feePlaceholder.default
    this.p_recipient = this.addressPlaceholder.alice
  },
  methods: {
    p_regenProof () {
      this.p_proof = this.$crypto.random20()
    },
    p_announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const recipient = this.$parser.parseAddress(this.p_recipient)
      const secretProofTransaction = SecretProofTransaction.create(
        Deadline.create(),
        this.p_hashType,
        this.p_secret,
        recipient,
        this.p_proof,
        account.address.networkType,
        UInt64.fromUint(this.p_fee)
      )
      const signedTx = account.sign(secretProofTransaction, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transactionStatus/${signedTx.hash}`
      }
      this.p_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
