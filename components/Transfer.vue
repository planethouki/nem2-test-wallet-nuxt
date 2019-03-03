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
          label="Mosaics (namespace:mosaic::absoluteAmount) (comma separated)"
          v-model="t_mosaics"
          required)
        v-text-field(
          label="Message"
          v-model="t_message"
          :counter="1024"
          placeholder="ex) Thank you.")
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
  Address, Deadline, UInt64, NetworkType, PlainMessage, TransferTransaction, Mosaic, MosaicId,
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
      t_mosaics: 'nem:xem::1000000',
      t_message: 'Hello Nem2!',
      t_history: []
    }
  },
  methods: {
    t_announceHandler: function (event) {
      const account = this.wallet.open(this.walletPassword)
      const recipient = this.t_recipient
      const message = this.t_message
      const endpoint = this.endpoint
      const mosaics = this.t_mosaics.split(',').map((mosaicRawStr) => {
        const nameAndAmount = mosaicRawStr.split('::')
        return new Mosaic(
          new MosaicId(nameAndAmount[0]),
          UInt64.fromUint(Number(nameAndAmount[1]))
        )
      })
      const tx = TransferTransaction.create(
        Deadline.create(23),
        Address.createFromRawAddress(recipient),
        mosaics,
        PlainMessage.create(message),
        NetworkType.MIJIN_TEST
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
