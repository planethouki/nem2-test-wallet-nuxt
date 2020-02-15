<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Create Mosaic
      v-card-text
        .d-flex
          v-checkbox(v-model="m_supplyMutable" class="mx-2" label="Supply Mutable")
          v-checkbox(v-model="m_transferable" class="mx-2" label="Transferable")
          v-checkbox(v-model="m_restrictable" class="mx-2" label="Restrictable")
        v-text-field(
          label="Nonce (Number)"
          v-model="m_nonce"
          required
          type="number"
          placeholder="ex). 35426"
          min="0"
          max="4294967295")
        v-text-field(
          label="MosaicId"
          :value="mosaicId.toHex()"
          disabled)
        v-text-field(
          label="Supply Amount"
          v-model="m_delta"
          required
          type="number"
          min="0"
          placeholder="ex). 100")
        v-text-field(
          label="Divisibility"
          v-model="m_divisibility"
          required
          type="number"
          min="0"
          placeholder="ex). 0")
        v-text-field(
          label="Duration In Blocks"
          v-model="m_duration"
          required
          type="number"
          min="0"
          placeholder="ex). 10")
        v-text-field(
          label="Max Fee"
          v-model="m_fee"
          required
          min="0"
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="m_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="m_history")
</template>

<script>
import TxHistory from '../history/TxHistory.vue'
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, TransactionHttp, MosaicId, MosaicNonce,
  MosaicDefinitionTransaction, MosaicSupplyChangeTransaction, MosaicFlags, MosaicSupplyChangeAction,
  AggregateTransaction
} from 'nem2-sdk'

export default {
  name: 'MosaicDefinition',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'mosaic'
      }
    }
  },
  data () {
    return {
      m_nonce: '0',
      m_supplyMutable: true,
      m_transferable: true,
      m_restrictable: true,
      m_divisibility: 0,
      m_duration: 0,
      m_delta: 100,
      m_fee: 0,
      m_history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'publicAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['feePlaceholder']),
    mosaicId () {
      const mosaicNonce = MosaicNonce.createFromHex(`00000000${Number(this.m_nonce).toString(16)}`.substr(-8))
      return MosaicId.createFromNonce(mosaicNonce, this.publicAccount)
    }
  },
  mounted () {
    this.m_fee = this.feePlaceholder.default
  },
  methods: {
    m_announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const networkType = account.address.networkType
      const mosaicNonce = MosaicNonce.createFromHex(`00000000${Number(this.m_nonce).toString(16)}`.substr(-8))
      const duration = this.m_duration
      const delta = this.m_delta
      const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
        Deadline.create(),
        mosaicNonce,
        this.mosaicId,
        MosaicFlags.create(
          this.m_supplyMutable,
          this.m_transferable,
          this.m_restrictable),
        this.m_divisibility,
        UInt64.fromUint(duration),
        networkType
      )
      const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
        Deadline.create(),
        mosaicDefinitionTransaction.mosaicId,
        MosaicSupplyChangeAction.Increase,
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
        [],
        UInt64.fromUint(this.m_fee)
      )
      const signedTx = account.sign(aggregateTransaction, this.generationHash)
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
