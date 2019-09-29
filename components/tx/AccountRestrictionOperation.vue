<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Restriction Operation
      v-card-text
        v-radio-group(label="Restriction Type" v-model="restrictionType")
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
          v-select(
            :items="operations"
            item-text="label"
            item-value="entityType"
            v-model="modification.entityType"
            label="Transaction Name").ml-2
          v-text-field(
          label="Entity Type"
          v-bind:value="Number(modification.entityType).toString(16).toUpperCase()"
          disabled).ml-2
          v-btn(
          fab
          small
          v-on:click="deleteModification(index)")
            v-icon delete_forever
        v-btn(
          @click="addModification"
          x-small) Add Modification
        v-text-field(
          label="Max Fee"
          v-model="fee").mt-5
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
import { Deadline, UInt64, AccountRestrictionType, TransactionHttp,
  AccountRestrictionModificationAction, AccountRestrictionModification,
  AccountOperationRestrictionTransaction, TransactionType } from 'nem2-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'AccountRestrictionOperation',
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
      restrictionType: AccountRestrictionType.AllowIncomingTransactionType,
      restrictionTypes: [
        { type: AccountRestrictionType.AllowIncomingTransactionType, label: 'Allow Incoming' },
        { type: AccountRestrictionType.AllowOutgoingTransactionType, label: 'Allow Outgoing' },
        { type: AccountRestrictionType.BlockIncomingTransactionType, label: 'Block Incoming' },
        { type: AccountRestrictionType.BlockOutgoingTransactionType, label: 'Block Outgoing' }
      ],
      modificationTypes: [
        { isAdd: true, label: 'Add' },
        { isAdd: false, label: 'Remove' }
      ],
      modifications: [
        {
          isAdd: true,
          entityType: TransactionType.SECRET_LOCK
        }
      ],
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['feePlaceholder']),
    operations () {
      return this.$transactionTypes
    }
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
        entityType: TransactionType.SECRET_LOCK,
        isAdd: true
      })
    },
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const accountOperationRestrictionTransaction = AccountOperationRestrictionTransaction.create(
        Deadline.create(),
        this.restrictionType,
        this.modifications.map((modification) => {
          return AccountRestrictionModification.createForOperation(
            modification.isAdd ? AccountRestrictionModificationAction.Add : AccountRestrictionModificationAction.Remove,
            modification.entityType
          )
        }),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(accountOperationRestrictionTransaction, this.generationHash)
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
