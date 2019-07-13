<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Property Address
      v-card-text
        v-radio-group(label="Property Type" v-model="propertyType" row)
          v-radio(
            v-for="pt in propertyTypes"
            :key="pt.type"
            :label="pt.label"
            :value="pt.type")
        v-flex.pt-4
          v-layout(v-for="(modification, index) in modifications" v-bind:key="modification.rawAddress" row wrap)
            v-flex
              v-layout(align-baseline)
                span.grey--text.mr-1.pr-1 {{ modification.isAdd ? 'Add' : 'Remove' }}
                v-flex
                  v-text-field(
                  v-bind:label="`${modification.isAdd ? 'Add' : 'Remove'}` + ' Modification Address: ' + (index + 1)"
                  v-bind:value="modification.rawAddress"
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
              v-bind:label="`Address Modification: ${additionalModification.isAdd ? 'Add' : 'Remove'}`"
              v-model="additionalModification.rawAddress"
              placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE")
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
import { Address, Deadline, UInt64, PropertyType, TransactionHttp,
  PropertyModificationType, AccountPropertyModification, ModifyAccountPropertyAddressTransaction } from 'nem2-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'AccountPropertyAddress',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'accountPropertyAddress'
      }
    }
  },
  data() {
    return {
      propertyType: PropertyType.AllowAddress,
      propertyTypes: [
        { type: PropertyType.AllowAddress, label: 'Allow' },
        { type: PropertyType.BlockAddress, label: 'Block' }
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
    deleteModification: function (index) {
      this.modifications.splice(index, 1)
    },
    addModification: function () {
      this.modifications.push({
        rawAddress: this.additionalModification.rawAddress,
        isAdd: this.additionalModification.isAdd
      })
      this.additionalModification.rawAddress = ''
    },
    announceHandler: function (event) {
      const account = this.account
      const endpoint = this.endpoint
      const modifyAccountPropertyAddressTransaction = ModifyAccountPropertyAddressTransaction.create(
        Deadline.create(),
        this.propertyType,
        this.modifications.map((modification) => {
          return AccountPropertyModification.createForAddress(
            modification.isAdd ? PropertyModificationType.Add : PropertyModificationType.Remove,
            Address.createFromRawAddress(modification.rawAddress)
          )
        }),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(modifyAccountPropertyAddressTransaction, this.generationHash)
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
