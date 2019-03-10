<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Mosaic Alias
      v-card-text
        v-radio-group(label="Alias Action Type" v-model="actionType" row)
          v-radio(
            v-for="at in actionTypes"
            :key="at.type"
            :label="at.label"
            :value="at.type")
        v-text-field(
          label="Namespace Name"
          v-model="namespaceName"
          required
          placeholder="ex). foo")
        v-text-field(
          label="hexMosaicId"
          v-model="hexMosaicId"
          required)
        v-text-field(
          label="Max Fee"
          v-model="fee")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="announceHandler") announce
      v-card-text
        tx-history(v-bind:history="history")
</template>

<script>
import { Deadline, UInt64, NamespaceId, MosaicId, AliasActionType, TransactionHttp, MosaicAliasTransaction } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'MosaicAlias',
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
      actionType: AliasActionType.Link,
      actionTypes: [
        { type: AliasActionType.Link, label: 'Link' },
        { type: AliasActionType.Unlink, label: 'Unlink' }
      ],
      namespaceName: 'foo',
      hexMosaicId: '79DC0ABC22594941',
      fee: 0,
      history: []
    }
  },
  methods: {
    announceHandler: function (event) {
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const mosaicAliasTransaction = new MosaicAliasTransaction(
        this.wallet.network,
        this.$TransactionVersion.MOSAIC_ALIAS,
        Deadline.create(),
        UInt64.fromUint(this.fee),
        this.actionType,
        new NamespaceId(this.namespaceName),
        new MosaicId(this.hexMosaicId)
      )
      const signedTx = account.sign(mosaicAliasTransaction)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
