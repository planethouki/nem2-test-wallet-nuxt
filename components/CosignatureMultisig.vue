<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Cosignature Transaction of Multisig
      v-card-text
        v-text-field(
          label="Multisig Account PublicKey"
          v-model="g_multisigPublicKey"
          required
          :counter="64"
          placeholder="ex). AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26")
        v-text-field(
          label="Aggregate Bonded Transaction Hash"
          v-model="g_hash"
          required
          :counter="64"
          placeholder="ex). 2EE75F50BCF5384738350AC19A562841450F0B5E2F58B79FF641D1DEAE6B13EB")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="g_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="g_history")
</template>

<script>
  import TxHistory from './TxHistory.vue'
  import {
    AccountHttp, Password, NetworkType, TransactionHttp, PublicAccount, CosignatureTransaction} from 'nem2-sdk';
  import { throwIfEmpty, filter, mergeMap} from 'rxjs/operators';

  export default {
    name: "CosignatureMultisig",
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
        g_multisigPublicKey: "AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26",
        g_hash: "",
        g_history: [],
      }
    },
    methods: {
      g_announceHandler: function(event) {
        const multisigPublicAccount = PublicAccount.createFromPublicKey(this.g_multisigPublicKey, NetworkType.MIJIN_TEST);
        const account = this.wallet.open(this.walletPassword);
        const hash = this.g_hash;
        const endpoint = this.endpoint;
        const txHttp = new TransactionHttp(endpoint);
        const accountHttp = new AccountHttp(endpoint);
        accountHttp.aggregateBondedTransactions(multisigPublicAccount).pipe(
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
          this.g_history.push(historyData);
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
