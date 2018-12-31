<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Register Sub Namespace
      v-card-text
        v-text-field(
          label="Sub Namespace Name"
          v-model="s_name"
          required
          placeholder="ex). sub")
        v-text-field(
          label="Parent Namespace"
          v-model="s_parentNamespace"
          required
          placeholder="ex). foo")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="s_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="s_history")
</template>

<script>
  import TxHistory from './TxHistory.vue'
  import {Deadline, NetworkType, Password, TransactionHttp, RegisterNamespaceTransaction} from 'nem2-sdk'

  export default {
    name: "SubNamespace",
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
        s_name: "sub",
        s_parentNamespace: "foo",
        s_history: [],
      }
    },
    methods: {
      s_announceHandler: function(event) {
        const namespaceName = this.s_name;
        const parentNamespace = this.s_parentNamespace;
        const account = this.wallet.open(this.walletPassword);
        const endpoint = this.endpoint;
        let registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
          Deadline.create(),
          namespaceName,
          parentNamespace,
          NetworkType.MIJIN_TEST,
        );
        let signedTx = account.sign(registerNamespaceTransaction);
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(console.log, console.error);
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.s_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
