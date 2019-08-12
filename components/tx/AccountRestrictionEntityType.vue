<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Restriction Entity Type
      v-card-text
        v-radio-group(label="Restriction Type" v-model="restrictionType" row)
          v-radio(
            v-for="pt in restrictionTypes"
            :key="pt.type"
            :label="pt.label"
            :value="pt.type")
        v-flex.pt-4
          v-layout(v-for="(modification, index) in modifications" v-bind:key="modification.hexOperation" row wrap)
            v-flex
              v-layout(align-baseline)
                span.grey--text.mr-1.pr-1 {{ modification.isAdd ? 'Add' : 'Remove' }}
                v-flex
                  v-text-field(
                  v-bind:label="`${modification.isAdd ? 'Add' : 'Remove'}` + ' Modification Entity Type: ' + (index + 1)"
                  v-bind:value="modification.hexOperation"
                  disabled)
                v-btn(
                fab
                small
                flat
                v-on:click="deleteModification(index)")
                  v-icon delete_forever
        v-flex
          v-layout(align-baseline)
            div.mr-1.pr-1
              v-checkbox(
              v-bind:label="`${additionalModification.isAdd ? 'Add' : 'Remove'}`"
              hide-details
              off-icon="remove_circle"
              on-icon="add_circle"
              v-model="additionalModification.isAdd")
            v-flex
              v-text-field(
                v-bind:label="`Hex Entity Type Modification: ${additionalModification.isAdd ? 'Add' : 'Remove'}`"
                v-model="additionalModification.hexOperation"
                placeholder="ex). 4152")
              v-select(
                :items="operations"
                item-text="label"
                item-value="hexOperation"
                v-model="additionalModification.hexOperation"
                label="(Option) Select From")
            v-btn(
            fab
            small
            flat
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
import { Deadline, UInt64, RestrictionType, TransactionHttp,
  RestrictionModificationType, AccountRestrictionModification,
  AccountOperationRestrictionModificationTransaction } from 'nem2-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'AccountRestrictionAddress',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'accountRestrictionOperation'
      }
    }
  },
  data () {
    return {
      restrictionType: RestrictionType.AllowTransaction,
      restrictionTypes: [
        { type: RestrictionType.AllowTransaction, label: 'Allow' },
        { type: RestrictionType.BlockTransaction, label: 'Block' }
      ],
      modifications: [
        {
          isAdd: true,
          hexOperation: '4152'
        }
      ],
      additionalModification: {
        isAdd: true,
        hexOperation: '4152'
      },
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    operations () {
      return this.$transactionTypes.map((x) => {
        return { label: x.label, operation: x.entityType, hexOperation: x.entityType.toString(16).toUpperCase() }
      })
    }
  },
  methods: {
    deleteModification (index) {
      this.modifications.splice(index, 1)
    },
    addModification () {
      this.modifications.push({
        hexOperation: this.additionalModification.hexOperation,
        isAdd: this.additionalModification.isAdd
      })
      this.additionalModification.rawAddress = '4152'
    },
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const accountOperationRestrictionModificationTransaction = AccountOperationRestrictionModificationTransaction.create(
        Deadline.create(),
        this.restrictionType,
        this.modifications.map((modification) => {
          return AccountRestrictionModification.createForOperation(
            modification.isAdd ? RestrictionModificationType.Add : RestrictionModificationType.Remove,
            Number('0x'.concat(modification.hexOperation))
          )
        }),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(accountOperationRestrictionModificationTransaction, this.generationHash)
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
