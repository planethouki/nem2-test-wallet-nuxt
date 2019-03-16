<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Current Linked Public Key
          v-btn(
          fab
          small
          flat
          @click="reloadAccount")
            v-icon cached
      v-card-text
        p {{ remoteAccountKey }}
</template>

<script>
// eslint-disable-next-line
import { Account } from 'nem2-sdk'

export default {
  name: 'AccountLinkInfo',
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId'
  ],
  data() {
    return {
      remoteAccountKey: '',
      fee: 0,
      history: []
    }
  },
  watch: {
    wallet: {
      handler: function () {
        if (this.wallet.address) {
          this.reloadAccount()
        }
      }
    }
  },
  methods: {
    reloadAccount: async function (event) {
      const rp = require('request-promise-native')
      const account = await rp(`${this.endpoint}/account/${this.wallet.address.plain()}`)
      const linkedAccountKey = this.$convert.base64ToHex(JSON.parse(account).account.linkedAccountKey)
      if (linkedAccountKey === '0000000000000000000000000000000000000000000000000000000000000000') {
        this.remoteAccountKey = 'none'
      } else {
        this.remoteAccountKey = linkedAccountKey
      }
    }
  }
}
</script>

<style scoped>

</style>
