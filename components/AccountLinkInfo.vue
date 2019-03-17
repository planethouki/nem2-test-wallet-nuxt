<template lang="pug">
  v-flex(mb-5 v-if="address" v-bind:id="navTargetId")
    v-card
      v-card-text
        v-layout(align-baseline)
          span.title Current Linked Public Key
          v-btn(
          fab
          small
          flat
          @click="reloadAccount")
            v-icon cached
        p {{ remoteAccountKey }}
</template>

<script>

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
      const linkedAccountKey = this.$convert.base64ToHex(JSON.parse(account).account.linkedAccountKey).toUpperCase()
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
