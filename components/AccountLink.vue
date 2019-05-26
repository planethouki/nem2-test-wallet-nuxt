<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Link
      v-card-text
        v-radio-group(label="Link Action" v-model="linkAction" row)
          v-radio(
          v-for="pt in linkActions"
          :key="pt.type"
          :label="pt.label"
          :value="pt.type")
        v-text-field(
          label="Remote Account Public Key"
          v-model="remoteAccountKey"
          :counter="64"
          required)
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
import { LinkAction, AccountLinkTransaction, Deadline, UInt64 } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'AccountLink',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'accountLink'
      }
    }
  },
  data() {
    return {
      remoteAccountKey: '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C',
      linkAction: LinkAction.Link,
      linkActions: [
        { type: LinkAction.Link, label: 'Link' },
        { type: LinkAction.Unlink, label: 'Unlink' }
      ],
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
      const accountLinkTransaction = AccountLinkTransaction.create(
        Deadline.create(),
        this.remoteAccountKey,
        this.linkAction,
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(accountLinkTransaction)
      const preSignedTxPayload = signedTx.payload
      const signedTxPayload = '99000000' + preSignedTxPayload.substr(8)
      const request = require('request')
      request({
        url: `${endpoint}/transaction`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        json: { 'payload': signedTxPayload }
      })

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
