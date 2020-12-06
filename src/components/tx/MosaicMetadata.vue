<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Mosaic Metadata Transaction
      v-card-text
        v-text-field(
          label="Target Mosaic ID"
          v-model="targetMosaicId"
          required
          placeholder="ex). 4A1B0170C0E51B73")
        v-radio-group(label="Target Namespace Owner" v-model="isSelfTarget" row).mt-5
          v-radio(
            label="Self"
            :value="true")
          v-radio(
            label="Other"
            :value="false")
        v-text-field(
          v-if="isSelfTarget"
          :value="publicAccount.publicKey"
          label="Target Mosaic Owner PublicKey"
          disabled)
        v-text-field(
          v-else
          label="Target Mosaic Owner PublicKey"
          v-model="targetPublicKey"
          placeholder="ex). 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57")
        v-text-field(
          label="Scoped Metadata Key"
          v-model="scopedMetadataKey"
          required
          placeholder="ex). 00000000000000c1")
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
          required)
        v-text-field(
          label="Lock Funds Max Fee"
          v-model="lockFee"
          required
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
  Deadline, UInt64, AggregateTransaction, MosaicMetadataTransaction,
  TransactionHttp, LockFundsTransaction, PublicAccount, MosaicId, RepositoryFactoryHttp
} from 'symbol-sdk'
import AggregatetxHistory from '../history/AggregatetxHistory.vue'

export default {
  name: 'MosaicMetadata',
  components: {
    AggregatetxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'mosaicMetadata'
      }
    }
  },
  data () {
    return {
      isSelfTarget: true,
      scopedMetadataKey: '00000000000000c1',
      targetMosaicId: '',
      targetPublicKey: '',
      valueSizeDelta: 22,
      metadataValue: 'sample mosaic metadata',
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
    this.targetPublicKey = this.publicKeyPlaceholder.alice
    this.targetMosaicId = this.mosaicPlaceholder.metadata
  },
  methods: {
    announceHandler (event) {
      if (this.isSelfTarget) {
        this.announceComplete()
      } else {
        this.announceBonded()
      }
    },
    announceComplete () {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const network = account.address.networkType
      const tx = MosaicMetadataTransaction.create(
        Deadline.create(),
        account.address,
        UInt64.fromHex(this.scopedMetadataKey),
        new MosaicId(this.targetMosaicId),
        Number(this.valueSizeDelta),
        this.metadataValue,
        network,
        UInt64.fromUint(this.fee)
      )
      const aggregateTx = AggregateTransaction.createComplete(
        Deadline.create(),
        [
          tx.toAggregate(account.publicAccount)
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
    async announceBonded () {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const network = account.address.networkType
      const targetPublicAccount = PublicAccount.createFromPublicKey(this.targetPublicKey, network)
      const tx = MosaicMetadataTransaction.create(
        Deadline.create(),
        targetPublicAccount.address,
        UInt64.fromHex(this.scopedMetadataKey),
        new MosaicId(this.targetMosaicId),
        Number(this.valueSizeDelta),
        this.metadataValue,
        network
      )
      const aggregateTx = AggregateTransaction.createBonded(
        Deadline.create(),
        [
          tx.toAggregate(targetPublicAccount)
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

      const historyData = {
        agHash: signedAggregateTx.hash,
        agApiStatusUrl: `${endpoint}/transactionStatus/${signedAggregateTx.hash}`,
        lfHash: signedLockFundsTx.hash,
        lfApiStatusUrl: `${endpoint}/transactionStatus/${signedLockFundsTx.hash}`
      }
      this.history.push(historyData)

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
