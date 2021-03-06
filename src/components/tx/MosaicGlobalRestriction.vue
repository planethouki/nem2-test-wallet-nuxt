<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Mosaic Global Restriction Transaction
      v-card-text
        v-text-field(
          label="Mosaic ID"
          v-model="mosaicId"
          required
          placeholder="ex). 4A1B0170C0E51B73")
        v-text-field(
          label="Restriction Key"
          v-model="restrictionKey"
          required
          placeholder="ex). 64A1AF497F3D71DE")
        .d-flex
          v-select(
            :items="mosaicRestrictionTypes"
            item-text="label"
            item-value="type"
            v-model="previousRestrictionType"
            label="Previous Restriction Type").flex-grow-0
          v-text-field(
            label="Previous Restriction Value"
            v-model="previousRestrictionValue"
            required
            placeholder="ex). 70AB4D9B3B6F0BE0").ml-2
        .d-flex
          v-select(
            :items="mosaicRestrictionTypes"
            item-text="label"
            item-value="type"
            v-model="newRestrictionType"
            label="New Restriction Type").flex-grow-0
          v-text-field(
            label="New Restriction Value"
            v-model="newRestrictionValue"
            required
            placeholder="ex). 2471F111DA236F1F").ml-2
        .d-flex
          v-switch(
            v-model="isReferenceMosaicId"
            label="Reference Mosaic ID")
          v-text-field(
            label="Reference Mosaic ID"
            v-model="referenceMosaicId"
            v-if="isReferenceMosaicId"
            :required="isReferenceMosaicId"
            placeholder="ex). 4A1B0170C0E51B73").ml-2
        v-text-field(
          label="Max Fee"
          type="number"
          min="0"
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
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, MosaicGlobalRestrictionTransaction, MosaicId,
  TransactionHttp, MosaicRestrictionType
} from 'symbol-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'MosaicGlobalRestriction',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'mosaicGlobalRestriction'
      }
    }
  },
  data () {
    return {
      mosaicId: '4A1B0170C0E51B73',
      restrictionKey: '00000000000000c1',
      previousRestrictionValue: '0000000000000000',
      previousRestrictionType: MosaicRestrictionType.NONE,
      newRestrictionValue: '00000000000000b3',
      newRestrictionType: MosaicRestrictionType.EQ,
      referenceMosaicId: '',
      isReferenceMosaicId: false,
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAccount',
      'endpoint'
    ]),
    ...mapGetters('chain', [
      'generationHash'
    ]),
    ...mapGetters('env', [
      'mosaicPlaceholder',
      'feePlaceholder'
    ]),
    mosaicRestrictionTypes () {
      return this.$mosaicRestrictionTypes
    }
  },
  mounted () {
    this.fee = this.feePlaceholder.default
    this.mosaicId = this.mosaicPlaceholder.restriction
    this.referenceMosaicId = this.mosaicPlaceholder.restriction
  },
  methods: {
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const referenceMosaicId = this.isReferenceMosaicId
        ? new MosaicId(this.referenceMosaicId)
        : new MosaicId(UInt64.fromUint(0).toDTO())
      const tx = MosaicGlobalRestrictionTransaction.create(
        Deadline.create(),
        new MosaicId(this.mosaicId),
        UInt64.fromHex(this.restrictionKey),
        UInt64.fromHex(this.previousRestrictionValue),
        this.previousRestrictionType,
        UInt64.fromHex(this.newRestrictionValue),
        this.newRestrictionType,
        account.address.networkType,
        referenceMosaicId,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(tx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx).toPromise()
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transactionStatus/${signedTx.hash}`
      }
      this.history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
