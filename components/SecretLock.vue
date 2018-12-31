<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Secret Lock Transaction
      v-card-text
        v-text-field(
          label="Proof (Hex secret value for lock)"
          v-model="l_proof"
          required
          placeholder="ex). 095B4FCD1F88F1785E59")
        v-text-field(
          label="Secret (SHA3_512 for Proof)"
          v-model="l_secret"
          disabled)
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
    Password, TransactionHttp, SecretLockTransaction, HashType} from 'nem2-sdk';
  import { sha3_512 } from 'js-sha3';
  const secureRandom = require('secure-random');

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
        l_proof: "095B4FCD1F88F1785E59",
        l_mosaic: "nem:xem::10000000",
        l_recipient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        l_duration: 240,
        l_history: [],
      }
    },
    computed: {
      l_secret: function() {
        const proof = this.l_proof;
        const hash = sha3_512.create();
        try {
          return hash.update(Buffer.from(proof, 'hex')).hex().toUpperCase();
        } catch(e) {
          return e.message
        }
      },
    },
    created: function() {
      const random = secureRandom(10);
      this.l_proof = random.map(x => x.toString(16)).join("").toUpperCase();
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
