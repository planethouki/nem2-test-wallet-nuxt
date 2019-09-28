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
        .d-flex.align-baseline.mt-4(
          v-for="(modification, index) in modifications"
          v-bind:key="modification.rawAddress")
          span.grey--text.mr-1.pr-1 {{ modification.isAdd ? 'Add' : 'Remove' }}
          v-text-field(
            v-bind:label="`${modification.isAdd ? 'Add' : 'Remove'}` + ' Modification Address: ' + (index + 1)"
            v-bind:value="modification.rawAddress"
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
            v-bind:label="`Address Modification: ${additionalModification.isAdd ? 'Add' : 'Remove'}`"
            v-model="additionalModification.rawAddress"
            placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE")
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
import { Address, Deadline, UInt64, AccountRestrictionType, TransactionHttp,
  AccountRestrictionModificationAction, AccountRestrictionModification,
  AccountAddressRestrictionTransaction } from 'nem2-sdk'
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
        return 'accountRestrictionAddress'
      }
    }
  },
  data () {
    return {
      restrictionType: AccountRestrictionType.AllowIncomingAddress,
      restrictionTypes: [
        { type: AccountRestrictionType.AllowIncomingAddress, label: 'Allow Incoming' },
        { type: AccountRestrictionType.AllowOutgoingAddress, label: 'Allow Outgoing' },
        { type: AccountRestrictionType.BlockIncomingAddress, label: 'Block Incoming' },
        { type: AccountRestrictionType.BlockOutgoingAddress, label: 'Block Outgoing' }
      ],
      modifications: [
        {
          isAdd: true,
          rawAddress: 'SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE'
        }
      ],
      additionalModification: {
        isAdd: true,
        rawAddress: ''
      },
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'endpoint', 'account']),
    ...mapGetters('chain', ['generationHash'])
  },
  methods: {
    deleteModification (index) {
      this.modifications.splice(index, 1)
    },
    addModification () {
      this.modifications.push({
        rawAddress: this.additionalModification.rawAddress,
        isAdd: this.additionalModification.isAdd
      })
      this.additionalModification.rawAddress = ''
    },
    announceHandler (event) {
      const account = this.account
      const endpoint = this.endpoint
      const accountAddressRestrictionTransaction = AccountAddressRestrictionTransaction.create(
        Deadline.create(),
        this.restrictionType,
        this.modifications.map((modification) => {
          return AccountRestrictionModification.createForAddress(
            modification.isAdd ? AccountRestrictionModificationAction.Add : AccountRestrictionModificationAction.Remove,
            Address.createFromRawAddress(modification.rawAddress)
          )
        }),
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
