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
        v-text-field(
          label="Proof"
          v-model="p_proof"
          required
          counter
          placeholder="ex). 095B4FCD1F88F1785E59")
        v-text-field(
          label="Hash"
          v-model="p_secret"
          disabled)
        v-text-field(
          label="Max Fee"
          v-model="p_fee"
          required
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
import { Deadline, SecretProofTransaction, HashType, UInt64 } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'SecretProof',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'secretproof'
      }
    }
  },
  data() {
    return {
      p_hashType: 0,
      p_hashTypes: [
        { type: HashType.Op_Sha3_256, label: 'Sha3-256' },
        { type: HashType.Op_Keccak_256, label: 'Keccak256' },
        { type: HashType.Op_Hash_256, label: 'Hash256' },
        { type: HashType.Op_Hash_160, label: 'Hash160' }
      ],
      p_proof: '',
      p_fee: 0,
      p_history: []
    }
  },
  computed: {
    p_secret: function () {
      switch (this.p_hashType) {
        case HashType.Op_Sha3_256:
          return this.$hash.sha3(this.p_proof)
        case HashType.Op_Keccak_256:
          return this.$hash.keccac(this.p_proof)
        case HashType.Op_Hash_256:
          return this.$hash.hash256(this.p_proof)
        case HashType.Op_Hash_160:
          return this.$hash.hash160(this.p_proof)
        default:
          return 'error'
      }
    },
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash'])
  },
  created: function () {
    this.p_proof = this.$crypto.random10()
  },
  methods: {
    p_announceHandler: function (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const secretProofTransaction = SecretProofTransaction.create(
        Deadline.create(),
        this.p_hashType,
        this.p_secret,
        this.p_proof,
        account.address.networkType,
        UInt64.fromUint(this.p_fee)
      )
      const preSignedTxPayload = account.sign(secretProofTransaction, this.generationHash).payload
      let signedTxPayload
      if (this.p_hashType === HashType.Op_Hash_160) {
        const sizeDec = 155 + (this.p_proof.length) / 2
        const size = this.$convert.endian('00000000'.concat(sizeDec.toString(16).toUpperCase()).substr(-8))
        const unsignedPayload = size + preSignedTxPayload.substring(8, 282) +
          '000000000000000000000000' + preSignedTxPayload.substr(282)
        signedTxPayload = this.$crypto.signTx(unsignedPayload, account)
      } else {
        signedTxPayload = preSignedTxPayload
      }
      const hash = this.$hash.getSinedTxHash(signedTxPayload)
      const request = require('request')
      request({
        url: `${endpoint}/transaction`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        json: { 'payload': signedTxPayload }
      })
      const historyData = {
        hash: hash,
        apiStatusUrl: `${endpoint}/transaction/${hash}/status`
      }
      this.p_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
