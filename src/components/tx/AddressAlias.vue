<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Address Alias
      v-card-text
        v-radio-group(label="Alias Action Type" v-model="actionType" row)
          v-radio(
            v-for="at in actionTypes"
            :key="at.type"
            :label="at.label"
            :value="at.type")
        v-text-field(
          label="Namespace Name"
          v-model="namespaceName"
          required
          placeholder="ex). foo")
        v-text-field(
          label="Address"
          v-model="rawAddress"
          required
          placeholder="ex). SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE")
        v-text-field(
          label="Max Fee"
          v-model="fee"
          min="0"
          type="number")
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
import { Deadline, UInt64, NamespaceId, Address, AliasAction, TransactionHttp, AddressAliasTransaction } from 'symbol-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'AddressAlias',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'addressAlias'
      }
    }
  },
  data () {
    return {
      actionType: AliasAction.Link,
      actionTypes: [
        { type: AliasAction.Link, label: 'Link' },
        { type: AliasAction.Unlink, label: 'Unlink' }
      ],
      namespaceName: 'foo',
      rawAddress: '',
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['feePlaceholder', 'addressPlaceholder'])
  },
  mounted () {
    this.fee = this.feePlaceholder.default
    this.rawAddress = this.addressPlaceholder.alice
  },
  methods: {
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const addressAliasTransaction = AddressAliasTransaction.create(
        Deadline.create(),
        this.actionType,
        new NamespaceId(this.namespaceName),
        Address.createFromRawAddress(this.rawAddress),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(addressAliasTransaction, this.generationHash)
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
