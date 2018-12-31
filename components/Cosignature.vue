<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Cosignature Transaction
      v-card-text
        v-text-field(
          label="Aggregate Bonded Transaction Hash"
          v-model="c_hash"
          required
          :counter="64"
          placeholder="ex). 19DFEF268B382252CCAA9FAF282EDDEF846BA57232AAF9875C2209103E51799E")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="c_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="c_history")
</template>

<script>
  import TxHistory from './TxHistory.vue'
  import {
    AccountHttp, Password, TransactionHttp, CosignatureTransaction} from 'nem2-sdk';
  import { throwIfEmpty, filter, mergeMap} from 'rxjs/operators';

  export default {
    name: "Cosignature",
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
        c_hash: "",
        c_history: [],
      }
    },
    methods: {
      c_announceHandler: function(event) {
        const account = this.wallet.open(this.walletPassword);
        const hash = this.c_hash;
        const endpoint = this.endpoint;
        const txHttp = new TransactionHttp(endpoint);
        const accountHttp = new AccountHttp(endpoint);
        accountHttp.aggregateBondedTransactions(account.publicAccount).pipe(
          mergeMap((_) => _),
          filter((_) => !_.signedByAccount(account.publicAccount)),
          throwIfEmpty(() => new Error('can not find that transaction hash')),
        ).toPromise().then((aggregateTx) => {
          let cosigTx = CosignatureTransaction.create(aggregateTx);
          let signedTx = account.signCosignatureTransaction(cosigTx);
          return txHttp.announceAggregateBondedCosignature(signedTx).toPromise()
        }).then((result) => {
          console.log(result);
          let historyData = {
            hash: hash,
            apiStatusUrl: `${endpoint}/transaction/${hash}/status`
          };
          this.c_history.push(historyData);
        }).catch((error) => {
          console.error(error)
        }).finally(() => {

        });
      },
    }
  }
</script>

<style scoped>

</style>
