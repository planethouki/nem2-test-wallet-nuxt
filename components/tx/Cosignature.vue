<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
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
import {
  AccountHttp, TransactionHttp, CosignatureTransaction } from 'nem2-sdk'
import { throwIfEmpty, filter, mergeMap } from 'rxjs/operators'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'Cosignature',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'cosignature'
      }
    }
  },
  data () {
    return {
      c_hash: '',
      c_history: []
    }
  },
  computed: {
    existsAccount () {
      return this.$store.getters['wallet/existsAccount']
    }
  },
  methods: {
    c_announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const hash = this.c_hash
      const txHttp = new TransactionHttp(endpoint)
      const accountHttp = new AccountHttp(endpoint)
      accountHttp.aggregateBondedTransactions(account.publicAccount).pipe(
        mergeMap(_ => _),
        filter(_ => !_.signedByAccount(account.publicAccount)),
        throwIfEmpty(() => new Error('can not find that transaction hash'))
      ).toPromise().then((aggregateTx) => {
        const cosigTx = CosignatureTransaction.create(aggregateTx)
        const signedTx = account.signCosignatureTransaction(cosigTx)
        return txHttp.announceAggregateBondedCosignature(signedTx).toPromise()
      }).then((result) => {
        const historyData = {
          hash,
          apiStatusUrl: `${endpoint}/transaction/${hash}/status`
        }
        this.c_history.push(historyData)
      })
    }
  }
}
</script>

<style scoped>

</style>
