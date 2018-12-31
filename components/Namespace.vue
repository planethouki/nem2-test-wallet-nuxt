<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Register Namespace
      v-card-text
        v-text-field(
          label="Namespace Name"
          v-model="n_name"
          required
          placeholder="ex). foo")
        v-text-field(
          label="Duration In Blocks"
          v-model="n_duration"
          required
          type="number"
          placeholder="ex). 10")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="n_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="n_history")
</template>

<script>
  import TxHistory from './TxHistory.vue'
  import {Deadline, UInt64, NetworkType, Password, TransactionHttp, RegisterNamespaceTransaction} from 'nem2-sdk';

  export default {
    name: "Namespace",
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
        n_name: "foo",
        n_duration: 60,
        n_history: [],
      }
    },
    methods: {
      n_announceHandler: function(event) {
        const namespace = this.n_name;
        const duration = this.n_duration;
        const account = this.wallet.open(this.walletPassword);
        const endpoint = this.endpoint;
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
          Deadline.create(),
          namespace,
          UInt64.fromUint(duration),
          NetworkType.MIJIN_TEST,
        );
        const signedTx = account.sign(registerNamespaceTransaction);
        const txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(console.log, console.error);
        const historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.n_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
