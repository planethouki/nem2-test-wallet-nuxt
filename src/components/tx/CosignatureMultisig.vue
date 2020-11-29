<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Cosignature Transaction of Multisig
      v-card-text
        v-text-field(
          label="Multisig Account PublicKey"
          v-model="g_multisigPublicKey"
          required
          :counter="64"
          :placeholder="`ex). ${publicKeyPlaceholder.dan}`")
        v-text-field(
          label="Aggregate Bonded Transaction Hash"
          v-model="g_hash"
          required
          :counter="64"
          placeholder="ex). 2EE75F50BCF5384738350AC19A562841450F0B5E2F58B79FF641D1DEAE6B13EB")
        div {{ g_message }}
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="g_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="g_history")
</template>

<script>
import { AccountHttp, TransactionHttp, PublicAccount, CosignatureTransaction } from 'symbol-sdk'
import { throwIfEmpty, filter, mergeMap } from 'rxjs/operators'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'CosignatureMultisig',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'cosignaturemultisig'
      }
    }
  },
  data () {
    return {
      g_multisigPublicKey: '',
      g_hash: '',
      g_history: [],
      g_message: ''
    }
  },
  computed: {
    existsAccount () {
      return this.$store.getters['wallet/existsAccount']
    },
    publicKeyPlaceholder () {
      return this.$store.getters['env/publicKeyPlaceholder']
    }
  },
  methods: {
    g_announceHandler (event) {
      this.g_message = ''
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const network = account.address.networkType
      const multisigPublicAccount = PublicAccount.createFromPublicKey(this.g_multisigPublicKey, network)
      const hash = this.g_hash
      const txHttp = new TransactionHttp(endpoint)
      const accountHttp = new AccountHttp(endpoint)
      accountHttp.getAccountPartialTransactions(multisigPublicAccount.address).pipe(
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
        this.g_history.push(historyData)
      }).catch((e) => {
        this.g_message = e.message
      })
    }
  }
}
</script>

<style scoped>

</style>
