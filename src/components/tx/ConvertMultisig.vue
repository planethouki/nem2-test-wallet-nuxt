<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Convert to Multisig
      v-card-text
        v-text-field(
          label="Min Approval"
          v-model="u_minApprovalDelta"
          required
          type="number"
          min="0"
          placeholder="ex). 2")
        v-text-field(
          label="Min Removal"
          v-model="u_minRemovalDelta"
          required
          type="number"
          min="0"
          placeholder="ex). 2")
        div.body-1 Cosignatories
        .d-flex.align-baseline.mt-3(v-for="(u_cosignatory, index) in u_cosignatories" v-bind:key="index")
          span {{ (index + 1) }}
          v-text-field(
            label="Cosignatory Address"
            v-model="u_cosignatory.address"
            required
            :counter="64").ml-2
          v-btn(
            icon
            v-on:click="u_deleteCosignatory(index)")
              v-icon delete_forever
        v-btn(
          @click="u_addCosignatory"
          x-small) Add Cosignatory
        v-text-field.pt-5(
          label="Max Fee"
          v-model="u_fee"
          required
          min="0"
          type="number").mt-5
        v-flex.pt-4
          v-text-field(
            label="Lock Funds Mosaic"
            :placeholder="`ex). ${mosaicPlaceholder.currency10}`"
            v-model="u_lockMosaic"
            required)
          v-text-field(
            label="Lock Funds Duration In Blocks"
            placeholder="ex). 480"
            v-model="u_lockDuration"
            required
            min="0"
            type="number")
          v-text-field(
            label="Lock Funds Max Fee"
            v-model="u_lockFee"
            required
            min="0"
            type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="u_announceHandler"
          :disabled="isMultisig || u_forbidMultisig") announce
        v-flex
          div(v-if="isMultisig || u_forbidMultisig") &nbsp; {{ u_announceDisabledMessage }}
      v-card-text
        aggregatetx-history(v-bind:history="u_history")
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Deadline, MultisigAccountModificationTransaction,
  Address, UInt64, AggregateTransaction,
  LockFundsTransaction, RepositoryFactoryHttp
} from 'symbol-sdk'
import AggregatetxHistory from '../history/AggregatetxHistory.vue'

export default {
  name: 'ConvertMultisig',
  components: {
    AggregatetxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'multisig'
      }
    }
  },
  data () {
    return {
      u_cosignatories: [],
      u_minApprovalDelta: 2,
      u_minRemovalDelta: 2,
      u_history: [],
      u_fee: 0,
      u_lockFee: 0,
      u_lockMosaic: '',
      u_lockDuration: 480,
      isMultisig: false
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'endpoint', 'address']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', [
      'addressPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ]),
    u_forbidMultisig () {
      return this.address.plain() === this.addressPlaceholder.self
    },
    u_announceDisabledMessage () {
      if (this.u_forbidMultisig) { return 'Please try another account.' }
      if (this.isMultisig) { return 'Already converted' }
      return ''
    }
  },
  watch: {},
  mounted () {
    this.u_lockMosaic = this.mosaicPlaceholder.currency10
    this.u_fee = this.feePlaceholder.default
    this.u_lockFee = this.feePlaceholder.default
    this.u_cosignatories = [
      { address: this.addressPlaceholder.alice },
      { address: this.addressPlaceholder.bob }
    ]
  },
  methods: {
    u_deleteCosignatory (index) {
      this.u_cosignatories.splice(index, 1)
    },
    u_addCosignatory () {
      this.u_cosignatories.push({
        publicKey: this.addressPlaceholder.carol
      })
    },
    async u_announceHandler () {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const networkType = account.address.networkType
      const minApprovalDelta = this.u_minApprovalDelta
      const minRemovalDelta = this.u_minRemovalDelta
      const cosignatories = this.u_cosignatories
      const tx = MultisigAccountModificationTransaction.create(
        Deadline.create(),
        minApprovalDelta,
        minRemovalDelta,
        cosignatories.map(co => Address.createFromRawAddress(co.address)),
        [],
        networkType
      )
      const aggregateTx = AggregateTransaction.createBonded(
        Deadline.create(),
        [
          tx.toAggregate(account.publicAccount)
        ],
        networkType,
        [],
        UInt64.fromUint(this.u_fee)
      )
      const signedAggregateTx = account.sign(aggregateTx, this.generationHash)
      const lockFundsTx = LockFundsTransaction.create(
        Deadline.create(),
        this.$parser.parseMosaic(this.u_lockMosaic),
        UInt64.fromUint(this.u_lockDuration),
        signedAggregateTx,
        networkType,
        UInt64.fromUint(this.u_lockFee)
      )
      const signedLockFundsTx = account.sign(lockFundsTx, this.generationHash)

      const historyData = {
        agHash: signedAggregateTx.hash,
        agApiStatusUrl: `${endpoint}/transactionStatus/${signedAggregateTx.hash}`,
        lfHash: signedLockFundsTx.hash,
        lfApiStatusUrl: `${endpoint}/transactionStatus/${signedLockFundsTx.hash}`
      }
      this.u_history.push(historyData)

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
