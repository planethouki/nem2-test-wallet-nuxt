<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Restriction Address
      v-card-text
        v-radio-group(label="Restriction Type" v-model="restrictionType" column)
          v-radio(
            v-for="pt in restrictionTypes"
            :key="pt.type"
            :label="pt.label"
            :value="pt.type")
        div.body-1 Modifications
        .d-flex.align-baseline.mt-1(v-for="(modification, index) in modifications" v-bind:key="index")
          span {{ (index + 1) }}
          v-select(
            :items="modificationTypes"
            item-text="label"
            item-value="isAdd"
            v-model="modification.isAdd"
            label="Modification Type").flex-grow-0.ml-2
          v-text-field(
            label="Address"
            v-model="modification.rawAddress").ml-2
          v-btn(
          icon
          v-on:click="deleteModification(index)")
            v-icon delete_forever
        v-btn(
          @click="addModification"
          x-small) Add Modification
        v-text-field(
          label="Max Fee"
          v-model="fee"
          min="0"
          type="number").mt-5
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
  Address, Deadline, UInt64, AccountRestrictionFlags, TransactionHttp,
  AccountAddressRestrictionTransaction
} from 'nem2-sdk'

export default {
  name: 'AccountRestrictionAddress',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'accountRestrictionAddress'
      }
    }
  },
  data () {
    return {
      restrictionType: AccountRestrictionFlags.AllowIncomingAddress,
      restrictionTypes: [
        { type: AccountRestrictionFlags.AllowIncomingAddress, label: 'Allow Incoming' },
        { type: AccountRestrictionFlags.AllowOutgoingAddress, label: 'Allow Outgoing' },
        { type: AccountRestrictionFlags.BlockIncomingAddress, label: 'Block Incoming' },
        { type: AccountRestrictionFlags.BlockOutgoingAddress, label: 'Block Outgoing' }
      ],
      modificationTypes: [
        { isAdd: true, label: 'Add' },
        { isAdd: false, label: 'Remove' }
      ],
      modifications: [],
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'endpoint', 'account']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['addressPlaceholder', 'feePlaceholder'])
  },
  mounted () {
    this.fee = this.feePlaceholder.default
    this.modifications = [{
      isAdd: true,
      rawAddress: this.addressPlaceholder.alice
    }]
  },
  methods: {
    deleteModification (index) {
      this.modifications.splice(index, 1)
    },
    addModification () {
      this.modifications.push({
        rawAddress: 'SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE',
        isAdd: true
      })
    },
    announceHandler (event) {
      const account = this.account
      const endpoint = this.endpoint
      const accountAddressRestrictionTransaction = AccountAddressRestrictionTransaction.create(
        Deadline.create(),
        this.restrictionType,
        this.modifications
          .filter(modification => modification.isAdd)
          .map(modification => Address.createFromRawAddress(modification.rawAddress)),
        this.modifications
          .filter(modification => !modification.isAdd)
          .map(modification => Address.createFromRawAddress(modification.rawAddress)),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(accountAddressRestrictionTransaction, this.generationHash)
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
