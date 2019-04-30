<template lang="pug">
  v-flex(mb-5 v-if="isShow" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Wallet
      v-card-text
        v-layout(column)
          div.subheading Endpoint
          v-layout(overflow-hidden align-center justify-space-between)
            v-list
              v-list-tile
                v-list-tile-content
                  v-list-tile-title(ref="endpoint") {{ endpoint }}
            v-btn(
              fab
              small
              flat
              @click="copyEndpointHandler")
              v-icon filter_none
        v-layout.mb-2(column)
          div.subheading Address
          v-layout(overflow-hidden align-center justify-space-between)
            v-list
              v-list-tile
                v-list-tile-content
                  v-list-tile-title(ref="address") {{ address.pretty() }}
                  v-list-tile-sub-title {{ address.plain() }}
            v-btn(
              fab
              small
              flat
              @click="copyAddressHandler")
              v-icon filter_none
        v-layout(column)
          div.subheading Public Key
          v-layout(overflow-hidden align-center justify-space-between)
            v-list-tile
              v-list
                v-list-tile-content
                  v-list-tile-title(ref="publicKey") {{ publicKey }}
            v-btn(
              fab
              small
              flat
              @click="copyPublicKeyHandler")
              v-icon filter_none
      v-card-actions
        v-btn(
        color="pink"
        class="white--text"
        @click="logoutWallet") logout
        v-spacer
      v-card-text(v-show="alert")
        v-alert(type="error" :value="alert") {{ alert }}
</template>

<script>

export default {
  name: 'WalletInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'wallet'
      }
    }
  },
  data() {
    return {
      alert: ''
    }
  },
  computed: {
    isShow() {
      return this.$store.getters['wallet/existsAccount']
    },
    address() {
      return this.$store.getters['wallet/getAddress']
    },
    endpoint() {
      return this.$store.getters['wallet/getEndpoint']
    },
    faucetUrl() {
      return this.$store.getters['wallet/getFaucet']
    },
    publicKey() {
      return this.$store.getters['wallet/getPublicAccount'].publicKey
    }
  },
  watch: {
  },
  methods: {
    logoutWallet: function (event) {
      this.$store.commit('wallet/logout')
    },
    copyEndpointHandler: function (event) {
      const target = this.$refs.endpoint
      const range = document.createRange()
      range.selectNode(target)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    },
    copyAddressHandler: function (event) {
      const target = this.$refs.address
      const range = document.createRange()
      range.selectNode(target)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    },
    copyPublicKeyHandler: function (event) {
      const target = this.$refs.publicKey
      const range = document.createRange()
      range.selectNode(target)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    }
  }
}
</script>

<style scoped>

</style>
