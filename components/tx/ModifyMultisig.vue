<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Modify Multisig
      v-card-text
        v-text-field(
          label="Multisig Account PublicKey"
          v-model="d_multisigPublicKey"
          required
          :counter="64"
          placeholder="ex). AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26")
        v-text-field(
          label="Approval Change"
          v-model="d_minApprovalDelta"
          required
          type="number"
          placeholder="ex). 2")
        v-text-field(
          label="Removal Change"
          v-model="d_minRemovalDelta"
          required
          type="number"
          placeholder="ex). 2")
        div.body-1 Modifications
        .d-flex.align-baseline.mt-1(v-for="(d_cosignatory, index) in d_cosignatories" v-bind:key="index")
          span {{ (index + 1) }}
          v-select(
            :items="d_modificationTypes"
            item-text="label"
            item-value="isAdd"
            v-model="d_cosignatory.isAdd"
            label="Cosignatory Modification Action").flex-grow-0.ml-2
          v-text-field(
            label="Cosignatory PublicKey"
            v-bind:value="d_cosignatory.pubKey"
            required
            :counter="64").ml-2
          v-btn(
            icon
            v-on:click="d_deleteModification(index)")
              v-icon delete_forever
        v-btn(
          @click="d_addModification"
          x-small) Add Modification
        v-text-field(
          label="Max Fee"
          v-model="d_fee"
          required
          min="0"
          type="number").mt-5
        v-text-field(
          label="Lock Funds Mosaic"
          :placeholder="`ex). ${mosaicPlaceholder.currency10}`"
          v-model="d_lockMosaic"
          required).mt-4
        v-text-field(
          label="Lock Funds Duration In Blocks"
          placeholder="ex). 480"
          v-model="d_lockDuration"
          min="0"
          type="number"
          required)
        v-text-field(
          label="Lock Funds Max Fee"
          v-model="d_lockFee"
          required
          min="0"
          type="number")
        v-card-actions
          v-btn(
            color="blue"
            class="white--text"
            @click="d_announceHandler") announce
        v-card-text
          aggregatetx-history(v-bind:history="d_history")
</template>

<script>
import AggregatetxHistory from '../history/AggregatetxHistory.vue'
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, TransactionHttp, AggregateTransaction,
  MultisigAccountModificationTransaction,
  PublicAccount, LockFundsTransaction
} from 'nem2-sdk'

export default {
  name: 'ModifyMultisig',
  components: {
    AggregatetxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'modifymultisig'
      }
    }
  },
  data () {
    return {
      d_multisigPublicKey: '',
      d_cosignatories: [],
      d_minApprovalDelta: -1,
      d_minRemovalDelta: -1,
      d_history: [],
      d_fee: 0,
      d_lockFee: 0,
      d_lockMosaic: '',
      d_lockDuration: 480,
      d_modificationTypes: [
        { isAdd: true, label: 'Add' },
        { isAdd: false, label: 'Remove' }
      ]
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'account', 'network', 'endpoint']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', [
      'publicKeyPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.d_lockMosaic = this.mosaicPlaceholder.currency10
    this.d_fee = this.feePlaceholder.default
    this.d_lockFee = this.feePlaceholder.default
    this.d_multisigPublicKey = this.publicKeyPlaceholder.dan
    this.d_cosignatories = [{ pubKey: this.publicKeyPlaceholder.alice, isAdd: false }]
  },
  methods: {
    d_deleteModification (index) {
      this.d_cosignatories.splice(index, 1)
    },
    d_addModification (event) {
      this.d_cosignatories.push({
        pubKey: this.publicKeyPlaceholder.bob,
        isAdd: false
      })
    },
    d_announceHandler (event) {
      const multisigPublicAccount = PublicAccount.createFromPublicKey(this.d_multisigPublicKey)
      const account = this.account
      const endpoint = this.endpoint
      const network = account.address.networkType
      const minApprovalDelta = this.d_minApprovalDelta
      const minRemovalDelta = this.d_minRemovalDelta
      const cosignatories = this.d_cosignatories
      const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
        Deadline.create(),
        minApprovalDelta,
        minRemovalDelta,
        cosignatories
          .filter(co => co.isAdd)
          .map(co => PublicAccount.createFromPublicKey(co.pubKey, network)),
        cosignatories
          .filter(co => !co.isAdd)
          .map(co => PublicAccount.createFromPublicKey(co.pubKey, network)),
        network
      )
      const aggregateTx = AggregateTransaction.createBonded(
        Deadline.create(),
        [
          multisigAccountModificationTransaction.toAggregate(multisigPublicAccount)
        ],
        network,
        [],
        UInt64.fromUint(this.d_fee)
      )
      const signedAggregateTx = account.sign(aggregateTx, this.generationHash)
      const lockMosaic = this.$parser.parseMosaic(this.d_lockMosaic)
      const lockFundsTx = LockFundsTransaction.create(
        Deadline.create(),
        lockMosaic,
        UInt64.fromUint(this.d_lockDuration),
        signedAggregateTx,
        network,
        UInt64.fromUint(this.d_lockFee)
      )
      const signedLockFundsTx = account.sign(lockFundsTx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedLockFundsTx)
      const unsubscribe = this.$store.subscribeAction((action, state) => {
        if (action.type !== 'transactions/confirmedAdded') { return }
        if (action.payload.transaction.transactionInfo.hash !== signedLockFundsTx.hash) { return }
        txHttp.announceAggregateBonded(signedAggregateTx)
        unsubscribe()
      })
      const historyData = {
        agHash: signedAggregateTx.hash,
        agApiStatusUrl: `${endpoint}/transaction/${signedAggregateTx.hash}/status`,
        lfHash: signedLockFundsTx.hash,
        lfApiStatusUrl: `${endpoint}/transaction/${signedLockFundsTx.hash}/status`
      }
      this.d_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
