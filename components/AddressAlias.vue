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
import { Deadline, UInt64, NamespaceId, Address, AliasActionType, TransactionHttp, AddressAliasTransaction } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'AddressAlias',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'addressAlias'
      }
    }
  },
  data() {
    return {
      actionType: AliasActionType.Link,
      actionTypes: [
        { type: AliasActionType.Link, label: 'Link' },
        { type: AliasActionType.Unlink, label: 'Unlink' }
      ],
      namespaceName: 'foo',
      rawAddress: 'SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE',
      fee: 0,
      history: []
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    }
  },
  methods: {
    announceHandler: function (event) {
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
      const signedTx = account.sign(addressAliasTransaction)
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
