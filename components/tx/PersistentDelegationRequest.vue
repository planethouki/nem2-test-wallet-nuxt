<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Persistent Delegation Request Transaction
      v-card-text
        v-text-field(
          label="Harvester Public Key"
          v-model="harvesterPublicKey"
          required
          placeholder="ex). 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57")
        v-text-field(
          label="Sender Private Key"
          v-model="senderPrivateKey"
          required
          placeholder="ex). 77A43F2031BC8D77A5FF7922FC5A9D29D80F700AC834E912CE9FB0F19C397EEF")
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
} from 'nem2-sdk'
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
      harvesterPublicKey: '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57',
      senderPrivateKey: '77A43F2031BC8D77A5FF7922FC5A9D29D80F700AC834E912CE9FB0F19C397EEF',
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
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.fee = this.feePlaceholder.default
  },
  methods: {
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const tx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
        Deadline.create(),
        this.harvesterPublicKey,
        this.senderPrivateKey,
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(tx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx).toPromise().then((resolve, reject) => {
      })
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
