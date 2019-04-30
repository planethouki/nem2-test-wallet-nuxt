<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Current Linked Public Key
      v-card-text
        v-layout(align-baseline)
        p {{ remoteAccountKey }}
      v-card-actions
        v-btn(
          @click="reloadAccount")
          v-icon cached
</template>

<script>

export default {
  name: 'AccountLinkInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'accountLinkInfo'
      }
    }
  },
  data() {
    return {
      remoteAccountKey: '',
      fee: 0,
      history: []
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    endpoint() {
      return this.$store.getters['wallet/getEndpoint']
    },
    address() {
      return this.$store.getters['wallet/getAddress']
    },
    walletMutateCount() {
      return this.$store.getters['wallet/getMutateCount']
    }
  },
  watch: {
    walletMutateCount: {
      handler: function () {
        this.reloadAccount()
      }
    }
  },
  mounted() {
    this.reloadAccount()
  },
  methods: {
    reloadAccount: function (event) {
      if (!this.existsAccount) return
      this.remoteAccountKey = ''
      const rp = require('request-promise-native')
      rp(`${this.endpoint}/account/${this.address.plain()}`).then((res) => {
        const linkedAccountKey = this.$convert.base64ToHex(JSON.parse(res).account.linkedAccountKey).toUpperCase()
        if (linkedAccountKey === '0000000000000000000000000000000000000000000000000000000000000000') {
          this.remoteAccountKey = 'None'
        } else {
          this.remoteAccountKey = linkedAccountKey
        }
      }).catch(() => {
        this.remoteAccountKey = 'None'
      })
    }
  }
}
</script>

<style scoped>

</style>
