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
        .d-flex.align-baseline.mt-4(
          v-for="(modification, index) in modifications"
          v-bind:key="modification.hexMosaicId")
          span.grey--text.mr-1.pr-1 {{ modification.isAdd ? 'Add' : 'Remove' }}
          v-text-field(
            v-bind:label="`${modification.isAdd ? 'Add' : 'Remove'}` + ' Modification Mosaic: ' + (index + 1)"
            v-bind:value="modification.hexMosaicId"
            disabled)
          v-btn(
            fab
            small
            v-on:click="deleteModification(index)")
              v-icon delete_forever
        .d-flex.align-baseline
          v-checkbox(
          v-bind:label="`${additionalModification.isAdd ? 'Add' : 'Remove'}`"
          hide-details
          off-icon="remove_circle"
          on-icon="add_circle"
          v-model="additionalModification.isAdd").mr-2
          v-text-field(
          v-bind:label="`Hex Mosaic ID Modification: ${additionalModification.isAdd ? 'Add' : 'Remove'}`"
          v-model="additionalModification.hexMosaicId"
          placeholder="ex). 41BC54DEB7515742")
          v-btn(
          fab
          small
          v-on:click="addModification")
            v-icon add_box
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
      modifications: [
        {
          isAdd: true,
          hexMosaicId: '41BC54DEB7515742'
        }
      ],
      additionalModification: {
        isAdd: true,
        hexMosaicId: '41BC54DEB7515742'
      },
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'account', 'endpoint']),
    ...mapGetters('chain', ['generationHash'])
  },
  methods: {
    deleteModification (index) {
      this.modifications.splice(index, 1)
    },
    addModification () {
      this.modifications.push({
        hexMosaicId: this.additionalModification.hexMosaicId,
        isAdd: this.additionalModification.isAdd
      })
      this.additionalModification.hexMosaicId = '41BC54DEB7515742'
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
