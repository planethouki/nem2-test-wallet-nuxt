<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Create Mosaic
      v-card-text
        v-text-field(
          label="Nonce (Number)"
          v-model="m_nonce"
          required
          type="number"
          placeholder="ex). 35426")
        v-text-field(
          label="Supply Amount"
          v-model="m_delta"
          required
          type="number"
          placeholder="ex). 100")
        v-text-field(
          label="Divisibility"
          v-model="m_divisibility"
          required
          type="number"
          placeholder="ex). 0")
        v-text-field(
          label="Duration In Blocks"
          v-model="m_duration"
          required
          type="number"
          placeholder="ex). 10")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="m_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="m_history")
</template>

<script>
import {
  Deadline, UInt64, TransactionHttp, MosaicId, MosaicNonce,
  MosaicDefinitionTransaction, MosaicSupplyChangeTransaction, MosaicProperties, MosaicSupplyType,
  AggregateTransaction } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'MosaicDefinition',
  components: {
    TxHistory
  },
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId'
  ],
  data() {
    return {
      m_nonce: '0',
      m_supplyMutable: true,
      m_transferable: true,
      m_levyMutable: false,
      m_divisibility: 0,
      m_duration: 10,
      m_delta: 100,
      m_history: []
    }
  },
  methods: {
    m_announceHandler: function (event) {
      const networkType = this.wallet.network
      const nonce = Number(this.m_nonce)
      const mosaicNonce = new MosaicNonce(this.$convert.numberToUint8_4(nonce))
      const duration = this.m_duration
      const delta = this.m_delta
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
        Deadline.create(),
        mosaicNonce,
        MosaicId.createFromNonce(mosaicNonce, account.publicAccount),
        MosaicProperties.create({
          supplyMutable: this.m_supplyMutable,
          transferable: this.m_transferable,
          levyMutable: this.levyMutable,
          divisibility: this.m_divisibility,
          duration: UInt64.fromUint(duration)
        }),
        networkType
      )
      const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
        Deadline.create(),
        mosaicDefinitionTransaction.mosaicId,
        MosaicSupplyType.Increase,
        UInt64.fromUint(delta),
        networkType
      )
      const aggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(),
        [
          mosaicDefinitionTransaction.toAggregate(account.publicAccount),
          mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)
        ],
        networkType,
        []
      )
      const signedTx = account.sign(aggregateTransaction)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.m_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
