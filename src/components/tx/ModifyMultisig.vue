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
            label="Cosignatory Address"
            v-bind:value="d_cosignatory.address"
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
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, RepositoryFactoryHttp, AggregateTransaction,
  MultisigAccountModificationTransaction,
  PublicAccount, LockFundsTransaction, Address
} from 'symbol-sdk'
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
      'addressPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.d_lockMosaic = this.mosaicPlaceholder.currency10
    this.d_fee = this.feePlaceholder.default
    this.d_lockFee = this.feePlaceholder.default
    this.d_multisigPublicKey = this.publicKeyPlaceholder.dan
    this.d_cosignatories = [{ address: this.addressPlaceholder.alice, isAdd: false }]
  },
  methods: {
    d_deleteModification (index) {
      this.d_cosignatories.splice(index, 1)
    },
    d_addModification () {
      this.d_cosignatories.push({
        address: this.addressPlaceholder.bob,
        isAdd: false
      })
    },
    async d_announceHandler () {
      const account = this.account
      const endpoint = this.endpoint
      const network = account.address.networkType
      const minApprovalDelta = this.d_minApprovalDelta
      const minRemovalDelta = this.d_minRemovalDelta
      const cosignatories = this.d_cosignatories
      const multisigPublicAccount = PublicAccount.createFromPublicKey(this.d_multisigPublicKey, network)
      const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
        Deadline.create(),
        minApprovalDelta,
        minRemovalDelta,
        cosignatories
          .filter(co => co.isAdd)
          .map(co => Address.createFromRawAddress(co.address)),
        cosignatories
          .filter(co => !co.isAdd)
          .map(co => Address.createFromRawAddress(co.address)),
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

      const historyData = {
        agHash: signedAggregateTx.hash,
        agApiStatusUrl: `${endpoint}/transactionStatus/${signedAggregateTx.hash}`,
        lfHash: signedLockFundsTx.hash,
        lfApiStatusUrl: `${endpoint}/transactionStatus/${signedLockFundsTx.hash}`
      }
      this.d_history.push(historyData)

      const repository = new RepositoryFactoryHttp(endpoint)
      const txHttp = repository.createTransactionRepository()
      const txStatusHttp = repository.createTransactionStatusRepository()
      // eslint-disable-next-line no-console
      await txHttp.announce(signedLockFundsTx).toPromise().then(console.log)
      for (let i = 0; i < 120; i++) {
        const st = await txStatusHttp
          .getTransactionStatus(signedLockFundsTx.hash)
          .toPromise()
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log(e.message)
            return {
              group: 'unknown'
            }
          })
        if (st.group === 'confirmed') {
          await txHttp
            .announceAggregateBonded(signedAggregateTx)
            .toPromise()
            // eslint-disable-next-line no-console
            .then(console.log)
          break
        }
        await new Promise((resolve) => {
          // eslint-disable-next-line no-console
          console.log('wait 1000')
          setTimeout(resolve, 1000)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
