<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Secret Lock Transaction
      v-card-text
        v-radio-group(label="Hash Type" v-model="l_hashType" row)
          v-radio(
          v-for="ht in l_hashTypes"
          :key="ht.type"
          :label="ht.label"
          :value="ht.type")
        v-text-field(
          label="Secret"
          :counter="l_hashStrLen"
          v-model="l_secret")
        v-text-field(
          label="Mosaic"
          v-model="l_mosaic"
          required
          :placeholder="`ex). ${mosaicPlaceholder.currency10}`")
        v-text-field(
          label="To Address"
          v-model="l_recipient"
          required
          placeholder="ex). SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC or @alice")
        v-text-field(
          label="Duration In Blocks"
          v-model="l_duration"
          required
          min="0"
          type="number"
          placeholder="ex). 240")
        v-text-field(
          label="Max Fee"
          v-model="l_fee"
          required
          min="0"
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="l_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="l_history")
</template>

<script>
import { mapGetters } from 'vuex'
import { Deadline, UInt64, SecretLockTransaction, HashType, TransactionHttp } from 'nem2-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'SecretLock',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'secretlock'
      }
    }
  },
  data () {
    return {
      l_hashType: HashType.Op_Sha3_256,
      l_hashStrLen: '64',
      l_hashTypes: [
        { type: HashType.Op_Sha3_256, label: 'Sha3-256', strLen: '64' },
        { type: HashType.Op_Keccak_256, label: 'Keccak256', strLen: '64' },
        { type: HashType.Op_Hash_256, label: 'Hash256', strLen: '64' },
        { type: HashType.Op_Hash_160, label: 'Hash160', strLen: '40' }
      ],
      l_mosaic: '',
      l_recipient: 'SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC',
      l_duration: 240,
      l_history: [],
      l_secret: '2B9DC1E6C02C96E690D4BC2E50BA8E8A0F3C065D98668D545C20E1A97B141B9D',
      l_fee: 0
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', [
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  watch: {
    l_hashType: {
      handler () {
        for (let i = 0; i < this.l_hashTypes.length; i++) {
          if (this.l_hashType === this.l_hashTypes[i].type) {
            this.l_hashStrLen = this.l_hashTypes[i].strLen
          }
        }
      }
    }
  },
  mounted () {
    this.l_mosaic = this.mosaicPlaceholder.currency10
    this.l_fee = this.feePlaceholder.default
  },
  methods: {
    l_announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const duration = this.l_duration
      const secret = this.l_secret
      const recipient = this.$parser.parseAddress(this.l_recipient)
      const mosaic = this.$parser.parseMosaic(this.l_mosaic)
      const secretLockTransaction = SecretLockTransaction.create(
        Deadline.create(),
        mosaic,
        UInt64.fromUint(duration),
        this.l_hashType,
        secret,
        recipient,
        account.address.networkType,
        UInt64.fromUint(this.l_fee)
      )
      const signedTx = account.sign(secretLockTransaction, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx).toPromise().then((resolve, reject) => {
      })
      const hash = signedTx.hash
      const historyData = {
        hash,
        apiStatusUrl: `${endpoint}/transaction/${hash}/status`
      }
      this.l_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
