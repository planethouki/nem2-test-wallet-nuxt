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
        .d-flex.align-baseline.mt-4(v-for="(d_cosignatory, index) in d_cosignatories" v-bind:key="d_cosignatory.pubKey")
          span.grey--text.mr-1.pr-1 {{ d_cosignatory.isAdd ? 'Add' : 'Remove' }}
          v-text-field(
            v-bind:label="`${d_cosignatory.isAdd ? 'Add' : 'Remove'}` + ' Cosignatory PublicKey: ' + (index + 1)"
            v-bind:value="d_cosignatory.pubKey"
            required
            :counter="64"
            disabled)
          v-btn(
            fab
            small
            v-on:click="d_deleteModification(index)")
              v-icon delete_forever
        .d-flex.align-baseline
          v-checkbox(
            v-bind:label="`${d_additionalModificationType ? 'Add' : 'Remove'}`"
            hide-details
            off-icon="remove_circle"
            on-icon="add_circle"
            v-model="d_additionalModificationType")
          v-text-field(
            v-bind:label="`Modification: ${d_additionalModificationType ? 'Add' : 'Remove'} Cosignatory PublicKey`"
            v-model="d_additionalModificationPubkey"
            :counter="64"
            placeholder="ex). C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0").ml-2
          v-btn(
            fab
            small
            v-on:click="d_addModification").ml-2
              v-icon add_box
        v-text-field(
          label="Max Fee"
          v-model="d_fee"
          required
          type="number")
        v-text-field(
          label="Lock Funds Mosaic"
          :placeholder="`ex). ${mosaicPlaceholder.currency10}`"
          v-model="d_lockMosaic"
          required).mt-4
        v-text-field(
          label="Lock Funds Duration In Blocks"
          placeholder="ex). 480"
          v-model="d_lockDuration"
          required)
        v-text-field(
          label="Lock Funds Max Fee"
          v-model="d_lockFee"
          required
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
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, TransactionHttp, AggregateTransaction,
  MultisigAccountModificationTransaction, MultisigCosignatoryModification,
  CosignatoryModificationAction, PublicAccount, LockFundsTransaction
} from 'nem2-sdk'
import AggregatetxHistory from '../history/AggregatetxHistory.vue'

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
      d_multisigPublicKey: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
      d_cosignatories: [
        { pubKey: '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C', isAdd: false }
      ],
      d_additionalModificationType: false,
      d_additionalModificationPubkey: '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57',
      d_minApprovalDelta: -1,
      d_minRemovalDelta: -1,
      d_history: [],
      d_fee: 0,
      d_lockFee: 0,
      d_lockMosaic: '',
      d_lockDuration: 480
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'account', 'network', 'endpoint']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', [
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.d_lockMosaic = this.mosaicPlaceholder.currency10
    this.d_fee = this.feePlaceholder.default
    this.d_lockFee = this.feePlaceholder.default
  },
  methods: {
    d_deleteModification (index) {
      this.d_cosignatories.splice(index, 1)
    },
    d_addModification (event) {
      this.d_cosignatories.push({
        pubKey: this.d_additionalModificationPubkey,
        isAdd: this.d_additionalModificationType
      })
      this.d_additionalModificationPubkey = ''
      this.d_additionalModificationType = false
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
        cosignatories.map((co) => {
          return new MultisigCosignatoryModification(
            co.isAdd ? CosignatoryModificationAction.Add : CosignatoryModificationAction.Remove,
            PublicAccount.createFromPublicKey(co.pubKey, network)
          )
        }),
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
