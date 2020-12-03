<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Metadata Transaction
      v-card-text
        v-text-field(
          label="Target PublicKey"
          v-model="targetPublicKey"
          required
          :placeholder="`ex). ${publicKeyPlaceholder.alice}`")
        v-text-field(
          label="Scoped Metadata Key"
          v-model="scopedMetadataKey"
          required
          placeholder="ex). 00000000000000a1")
        v-text-field(
          label="Value Size Delta"
          v-model="valueSizeDelta"
          required
          type="number"
          placeholder="ex). 16")
        v-text-field(
          label="Value"
          v-model="metadataValue"
          required
          placeholder="ex). foo")
        v-text-field(
          label="Max Fee"
          type="number"
          min="0"
          v-model="fee")
        v-text-field(
          label="Lock Funds Mosaic"
          :placeholder="`ex). ${mosaicPlaceholder.currency10}`"
          v-model="lockMosaic"
          required).mt-4
        v-text-field(
          label="Lock Funds Duration In Blocks"
          placeholder="ex). 480"
          v-model="lockDuration"
          type="number"
          min="0"
          required)
        v-text-field(
          label="Lock Funds Max Fee"
          v-model="lockFee"
          required
          min="0"
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="announceHandler") announce
      v-card-text
        aggregatetx-history(v-bind:history="history")
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, AggregateTransaction, AccountMetadataTransaction,
  TransactionHttp, LockFundsTransaction, PublicAccount
} from 'symbol-sdk'
import AggregatetxHistory from '../history/AggregatetxHistory.vue'

export default {
  name: 'AccountMetadata',
  components: {
    AggregatetxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'transfer'
      }
    }
  },
  data () {
    return {
      scopedMetadataKey: '00000000000000a1',
      targetPublicKey: '',
      valueSizeDelta: 23,
      metadataValue: 'sample account metadata',
      fee: 0,
      lockFee: 0,
      lockMosaic: '',
      lockDuration: 480,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAccount',
      'publicAccount',
      'endpoint'
    ]),
    ...mapGetters('chain', [
      'generationHash'
    ]),
    ...mapGetters('env', [
      'publicKeyPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.lockMosaic = this.mosaicPlaceholder.currency10
    this.fee = this.feePlaceholder.default
    this.lockFee = this.feePlaceholder.default
    this.targetPublicKey = this.publicAccount.publicKey
  },
  methods: {
    announceHandler (event) {
      if (this.targetPublicKey === this.publicAccount.publicKey) {
        this.announceComplete()
      } else {
        this.announceBonded()
      }
    },
    announceComplete () {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const network = account.address.networkType
      const tx = AccountMetadataTransaction.create(
        Deadline.create(),
        this.targetPublicKey,
        UInt64.fromHex(this.scopedMetadataKey),
        Number(this.valueSizeDelta),
        this.metadataValue,
        network,
        UInt64.fromUint(this.fee)
      )
      const aggregateTx = AggregateTransaction.createComplete(
        Deadline.create(),
        [
          tx.toAggregate(PublicAccount.createFromPublicKey(this.targetPublicKey, network))
        ],
        network,
        [],
        UInt64.fromUint(this.fee)
      )
      const signedAggregateTx = account.sign(aggregateTx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedAggregateTx)
      const historyData = {
        agHash: signedAggregateTx.hash,
        agApiStatusUrl: `${endpoint}/transactionStatus/${signedAggregateTx.hash}`,
        lfHash: 'omitted',
        lfApiStatusUrl: ''
      }
      this.history.push(historyData)
    },
    announceBonded () {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const network = account.address.networkType
      const tx = AccountMetadataTransaction.create(
        Deadline.create(),
        this.targetPublicKey,
        UInt64.fromHex(this.scopedMetadataKey),
        Number(this.valueSizeDelta),
        this.metadataValue,
        network
      )
      const aggregateTx = AggregateTransaction.createBonded(
        Deadline.create(),
        [
          tx.toAggregate(PublicAccount.createFromPublicKey(this.targetPublicKey, network))
        ],
        network,
        [],
        UInt64.fromUint(this.fee)
      )
      const signedAggregateTx = account.sign(aggregateTx, this.generationHash)
      const lockMosaic = this.$parser.parseMosaic(this.lockMosaic)
      const lockFundsTx = LockFundsTransaction.create(
        Deadline.create(),
        lockMosaic,
        UInt64.fromUint(this.lockDuration),
        signedAggregateTx,
        network,
        UInt64.fromUint(this.lockFee)
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
        agApiStatusUrl: `${endpoint}/transactionStatus/${signedAggregateTx.hash}`,
        lfHash: signedLockFundsTx.hash,
        lfApiStatusUrl: `${endpoint}/transactionStatus/${signedLockFundsTx.hash}`
      }
      this.history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
