<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Transfer Transaction
      v-card-text
        v-text-field(
          label="To Address"
          v-model="t_recipient"
          required
          placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE")
        v-text-field(
          label="Mosaics"
          v-model="t_mosaics"
          required
          placeholder="ex). @cat.currency::0, 941299B2B7E1291C::0")
        v-text-field(
          label="Message"
          v-model="t_message"
          :counter="1023"
          placeholder="ex) Thank you.")
        v-text-field(
          label="Max Fee"
          v-model="t_fee")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="t_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="t_history")
</template>

<script>
import {
  Address, Deadline, UInt64, PlainMessage, TransferTransaction,
  TransactionHttp
} from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'Transfer',
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
      t_recipient: 'SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE',
      t_mosaics: '@cat.currency::0, 941299B2B7E1291C::0',
      t_message: 'Hello Nem2!',
      t_fee: 0,
      t_history: []
    }
  },
  methods: {
    t_announceHandler: function (event) {
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const mosaics = this.$parser.parseMosaics(this.t_mosaics)
      const tx = new TransferTransaction(
        this.wallet.network,
        this.$TransactionVersion.TRANSFER,
        Deadline.create(),
        UInt64.fromUint(this.t_fee),
        Address.createFromRawAddress(this.t_recipient),
        mosaics,
        PlainMessage.create(this.t_message)
      )
      const signedTx = account.sign(tx)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx).toPromise().then((resolve, reject) => {
      })
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.t_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
