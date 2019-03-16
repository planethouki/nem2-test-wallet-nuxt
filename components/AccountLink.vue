<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Account Link (Not yet
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
import { Account, LinkAction, AccountLinkTransaction, Deadline, UInt64, TransactionHttp } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'AccountLink',
  components: {
    TxHistory
  },
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId'
  ],
  data() {
    return {
      remoteAccountKey: '',
      linkAction: LinkAction.Link,
      linkActions: [
        { type: LinkAction.Link, label: 'Link' },
        { type: LinkAction.Unlink, label: 'Unlink' }
      ],
      fee: 0,
      history: []
    }
  },
  watch: {
    wallet: {
      handler: function () {
        if (this.wallet.address) {
          this.remoteAccountKey = Account.generateNewAccount(this.wallet.network).publicKey
        }
      }
    }
  },
  methods: {
    announceHandler: function (event) {
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const accountLinkTransaction = new AccountLinkTransaction(
        this.wallet.network,
        this.$TransactionVersion.LINK_ACCOUNT,
        Deadline.create(),
        UInt64.fromUint(this.fee),
        this.remoteAccountKey,
        this.linkAction
      )
      const signedTx = account.sign(accountLinkTransaction)
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
