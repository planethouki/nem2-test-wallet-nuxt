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
  import TxHistory from './TxHistory.vue'

  import {
    Address, Deadline, UInt64, NetworkType, PlainMessage, TransferTransaction, Mosaic, MosaicId,
    Password, TransactionHttp
  } from 'nem2-sdk';

  export default {
    name: "Transfer",
    components: {
      TxHistory
    },
    props: [
      "endpoint",
      "wallet",
      "walletPassword",
      "navTargetId",
    ],
    data() {
      return {
        t_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        t_mosaics: "nem:xem::1000000",
        t_message: "Hello Nem2!",
        t_history: [],
      }
    },
    methods: {
      t_announceHandler: function(event) {
        const account = this.wallet.open(this.walletPassword);
        const recipient = this.t_recipient;
        const message = this.t_message;
        const endpoint = this.endpoint;
        const mosaics = this.t_mosaics.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::");
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(Number(nameAndAmount[1]))
          );
        });
        let tx = TransferTransaction.create(
          Deadline.create(23),
          Address.createFromRawAddress(recipient),
          mosaics,
          PlainMessage.create(message),
          NetworkType.MIJIN_TEST
        );
        let signedTx = account.sign(tx);
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).toPromise().then((resolve, reject) => {
        });
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.t_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
