<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Mosaic Address Restriction Transaction
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
          placeholder="ex). 00000000000000c1")
        v-text-field(
          label="Target Address"
          v-model="targetAddress"
          required
          :placeholder="`ex). ${addressPlaceholder.alice}`")
        v-text-field(
          label="Previous Restriction Value"
          v-model="previousRestrictionValue"
          required
          placeholder="ex). 70AB4D9B3B6F0BE0")
        v-text-field(
          label="New Restriction Value"
          v-model="newRestrictionValue"
          required
          placeholder="ex). 70AB4D9B3B6F0BE0")
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
import TxHistory from '../history/TxHistory.vue'
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, MosaicAddressRestrictionTransaction, MosaicId, Address,
  TransactionHttp
} from 'nem2-sdk'

export default {
  name: 'MosaicAddressRestriction',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'mosaicAddressRestriction'
      }
    }
  },
  data () {
    return {
      mosaicId: '4A1B0170C0E51B73',
      restrictionKey: '00000000000000c1',
      newRestrictionValue: '00000000000000d3',
      previousRestrictionValue: 'FFFFFFFFFFFFFFFF',
      targetAddress: '',
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
      'addressPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ]),
    mosaicRestrictionTypes () {
      return this.$mosaicRestrictionTypes
    }
  },
  mounted () {
    this.fee = this.feePlaceholder.default
    this.targetAddress = this.addressPlaceholder.alice
  },
  methods: {
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const tx = MosaicAddressRestrictionTransaction.create(
        Deadline.create(),
        new MosaicId(this.mosaicId),
        UInt64.fromHex(this.restrictionKey),
        Address.createFromRawAddress(this.targetAddress),
        UInt64.fromHex(this.newRestrictionValue),
        account.address.networkType,
        UInt64.fromHex(this.previousRestrictionValue),
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(tx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx).toPromise().then((resolve, reject) => {
      })
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
