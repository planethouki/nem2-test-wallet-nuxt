<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Restriction Mosaic
      v-card-text
        v-radio-group(label="Restriction Type" v-model="restrictionType" row)
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
            label="Mosaic ID"
            v-model="modification.hexMosaicId").ml-2
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
import { mapGetters } from 'vuex'
import { Deadline, UInt64, MosaicId, AccountRestrictionType, TransactionHttp,
  AccountRestrictionModificationAction, AccountRestrictionModification,
  AccountMosaicRestrictionTransaction } from 'nem2-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'AccountRestrictionMosaic',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'accountRestrictionMosaic'
      }
    }
  },
  data () {
    return {
      restrictionType: AccountRestrictionType.AllowMosaic,
      restrictionTypes: [
        { type: AccountRestrictionType.AllowMosaic, label: 'Allow' },
        { type: AccountRestrictionType.BlockMosaic, label: 'Block' }
      ],
      modificationTypes: [
        { isAdd: true, label: 'Add' },
        { isAdd: false, label: 'Remove' }
      ],
      modifications: [
        {
          isAdd: true,
          hexMosaicId: '41BC54DEB7515742'
        }
      ],
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'account', 'endpoint']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['feePlaceholder'])
  },
  mounted () {
    this.fee = this.feePlaceholder.default
  },
  methods: {
    deleteModification (index) {
      this.modifications.splice(index, 1)
    },
    addModification () {
      this.modifications.push({
        hexMosaicId: '41BC54DEB7515742',
        isAdd: true
      })
    },
    announceHandler (event) {
      const account = this.account
      const endpoint = this.endpoint
      const accountMosaicRestrictionTransaction = AccountMosaicRestrictionTransaction.create(
        Deadline.create(),
        this.restrictionType,
        this.modifications.map((modification) => {
          return AccountRestrictionModification.createForMosaic(
            modification.isAdd ? AccountRestrictionModificationAction.Add : AccountRestrictionModificationAction.Remove,
            new MosaicId(modification.hexMosaicId)
          )
        }),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(accountMosaicRestrictionTransaction, this.generationHash)
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
