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
          v-model="fee"
          min="0"
          type="number")
      v-card-actions
        v-btn(
        color="blue"
        class="white--text"
        @click="announceHandler"
        :disabled="forbidLink") announce
        v-flex
          div(v-if="forbidLink") &nbsp; Please try another account.
      v-card-text
        tx-history(v-bind:history="history")
</template>

<script>
import { mapGetters } from 'vuex'
import { LinkAction, AccountKeyLinkTransaction, Deadline, UInt64, TransactionHttp } from 'symbol-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'AccountLink',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'accountLink'
      }
    }
  },
  data () {
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
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'address', 'account', 'endpoint']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['feePlaceholder', 'addressPlaceholder', 'publicKeyPlaceholder']),
    forbidLink () {
      return this.address.plain() === this.addressPlaceholder.self
    }
  },
  mounted () {
    this.fee = this.feePlaceholder.default
    this.remoteAccountKey = this.publicKeyPlaceholder.alice
  },
  methods: {
    announceHandler (event) {
      const account = this.account
      const endpoint = this.endpoint
      const accountLinkTransaction = AccountKeyLinkTransaction.create(
        Deadline.create(),
        this.remoteAccountKey,
        this.linkAction,
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(accountLinkTransaction, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transactionStatus/${signedTx.hash}`
      }
      this.history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
