<template lang="pug">
  v-flex(mb-5 v-if="address" v-bind:id="navTargetId")
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
    'address',
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
    address: {
      handler: function () {
        if (this.address) {
          this.reloadAccount()
        }
      }
    }
  },
  methods: {
    reloadAccount: async function (event) {
      this.remoteAccountKey = ''
      const rp = require('request-promise-native')
      const account = await rp(`${this.endpoint}/account/${this.address.plain()}`)
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
