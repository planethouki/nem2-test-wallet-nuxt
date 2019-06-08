<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Property Entity Type
      v-card-text
        v-radio-group(label="Property Type" v-model="propertyType" row)
          v-radio(
            v-for="pt in propertyTypes"
            :key="pt.type"
            :label="pt.label"
            :value="pt.type")
        v-flex.pt-4
          v-layout(v-for="(modification, index) in modifications" v-bind:key="modification.hexEntityType" row wrap)
            v-flex
              v-layout(align-baseline)
                span.grey--text.mr-1.pr-1 {{ modification.isAdd ? 'Add' : 'Remove' }}
                v-flex
                  v-text-field(
                  v-bind:label="`${modification.isAdd ? 'Add' : 'Remove'}` + ' Modification Entity Type: ' + (index + 1)"
                  v-bind:value="modification.hexEntityType"
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
                v-model="additionalModification.hexEntityType"
                placeholder="ex). 4152")
              v-select(
                :items="entityTypes"
                item-text="label"
                item-value="hexEntityType"
                v-model="additionalModification.hexEntityType"
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
import { Deadline, UInt64, PropertyType, TransactionHttp,
  PropertyModificationType, AccountPropertyTransaction, ModifyAccountPropertyEntityTypeTransaction } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'AccountPropertyAddress',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'accountPropertyEntityType'
      }
    }
  },
  data() {
    return {
      propertyType: PropertyType.AllowTransaction,
      propertyTypes: [
        { type: PropertyType.AllowTransaction, label: 'Allow' },
        { type: PropertyType.BlockTransaction, label: 'Block' }
      ],
      modifications: [
        {
          isAdd: true,
          hexEntityType: '4152'
        }
      ],
      additionalModification: {
        isAdd: true,
        hexEntityType: '4152'
      },
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    entityTypes() {
      return this.$transactionTypes.map((x) => {
        return { label: x.label, entityType: x.entityType, hexEntityType: x.entityType.toString(16).toUpperCase() }
      })
    }
  },
  methods: {
    deleteModification: function (index) {
      this.modifications.splice(index, 1)
    },
    addModification: function () {
      this.modifications.push({
        hexEntityType: this.additionalModification.hexEntityType,
        isAdd: this.additionalModification.isAdd
      })
      this.additionalModification.rawAddress = '4152'
    },
    announceHandler: function (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const modifyAccountPropertyEntityTypeTransaction = ModifyAccountPropertyEntityTypeTransaction.create(
        Deadline.create(),
        this.propertyType,
        this.modifications.map((modification) => {
          return AccountPropertyTransaction.createEntityTypeFilter(
            modification.isAdd ? PropertyModificationType.Add : PropertyModificationType.Remove,
            Number('0x'.concat(modification.hexEntityType))
          )
        }),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(modifyAccountPropertyEntityTypeTransaction, this.generationHash)
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
