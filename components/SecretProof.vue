<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Secret Proof Transaction
      v-card-text
        v-text-field(
          label="Proof (Hex value for unlock)"
          v-model="p_proof"
          required
          placeholder="ex). 095B4FCD1F88F1785E59")
        v-text-field(
          label="Secret (SHA3_512 for Proof)"
          v-model="p_secret"
          disabled)
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="p_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="p_history")
</template>

<script>
  import TxHistory from './TxHistory.vue'
  import {Deadline, NetworkType, Password, TransactionHttp, SecretProofTransaction, HashType} from 'nem2-sdk';
  import { sha3_512 } from 'js-sha3';
  const secureRandom = require('secure-random');

  export default {
    name: "SecretProof",
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
        p_proof: "095B4FCD1F88F1785E59",
        p_history: [],
      }
    },
    computed: {
      p_secret: function() {
        const proof = this.p_proof;
        const hash = sha3_512.create();
        try {
          return hash.update(Buffer.from(proof, 'hex')).hex().toUpperCase();
        } catch(e) {
          return e.message
        }
      },
    },
    methods: {
      p_announceHandler: function(event) {
        const account = this.wallet.open(this.walletPassword);
        const endpoint = this.endpoint;
        const secret = this.p_secret;
        const proof = this.p_proof;
        let secretProofTransaction = SecretProofTransaction.create(
          Deadline.create(),
          HashType.SHA3_512,
          secret,
          proof,
          NetworkType.MIJIN_TEST
        );
        let signedTx = account.sign(secretProofTransaction);
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(console.log, console.error);
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.p_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
