<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Secret Lock Transaction
      v-card-text
        v-text-field(
          label="Secret (SHA3_512 for Random)"
          v-model="l_secret")
        v-text-field(
          label="Mosaic for Lock (namespace:mosaic::absoluteAmount) (Single Mosaic)"
          v-model="l_mosaic"
          required
          placeholder="ex). 100")
        v-text-field(
          label="To Address"
          v-model="l_recipient"
          required
          placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE")
        v-text-field(
          label="Duration In Blocks"
          v-model="l_duration"
          required
          type="number"
          placeholder="ex). 240")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="l_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="l_history")
</template>

<script>
  import TxHistory from './TxHistory.vue'
  import {
    Address, Deadline, UInt64, NetworkType, Mosaic, MosaicId,
    TransactionHttp, SecretLockTransaction, HashType} from 'nem2-sdk';

  export default {
    name: "SecretLock",
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
        l_mosaic: "nem:xem::10000000",
        l_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        l_duration: 240,
        l_history: [],
        l_secret: "B271D49970445F078CAD6979B75642B55C14DFAADF8067FE450332C63F60DE622B9DC1E6C02C96E690D4BC2E50BA8E8A0F3C065D98668D545C20E1A97B141B9D",
      }
    },
    methods: {
      l_announceHandler: function(event) {
        const account = this.wallet.open(this.walletPassword);
        const endpoint = this.endpoint;
        const duration = this.l_duration;
        const secret = this.l_secret;
        const recipient = this.l_recipient;
        const nameAndAmount = this.l_mosaic.split("::");
        const mosaic =  new Mosaic(new MosaicId(nameAndAmount[0]), UInt64.fromUint(nameAndAmount[1]));
        let secretLockTransaction = SecretLockTransaction.create(
          Deadline.create(),
          mosaic,
          UInt64.fromUint(duration),
          HashType.SHA3_512,
          secret,
          Address.createFromRawAddress(recipient),
          NetworkType.MIJIN_TEST
        );
        let signedTx = account.sign(secretLockTransaction);
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(console.log, console.error);
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.l_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
