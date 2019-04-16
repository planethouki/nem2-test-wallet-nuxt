<template lang="pug">
  v-flex(mb-5 v-if="isShow" v-bind:id="navTargetId")
    v-card
      v-card-title.pb-0
        v-layout(align-baseline)
          span.title Address
          v-btn(
          fab
          small
          flat
          @click="copyAddressHandler")
            v-icon filter_none
      v-card-text.pt-0
        v-layout(overflow-hidden)
          v-list
            v-list-tile
              v-list-tile-content
                v-list-tile-title(ref="address") {{ address.pretty() }}
                v-list-tile-sub-title {{ address.plain() }}
      v-card-title.pb-0
        v-layout(align-baseline)
          span.title Public Key
          v-btn(
          fab
          small
          flat
          @click="copyPublicKeyHandler")
            v-icon filter_none
      v-card-text.pt-0
        v-layout(overflow-hidden)
          v-list-tile
            v-list
              v-list-tile-content
                v-list-tile-sub-title(ref="publicKey") {{ publicKey }}
      v-card-actions
        v-btn(
        color="pink"
        class="white--text"
        @click="logoutWallet") logout
        v-spacer
        v-menu(offset-y)
          template(v-slot:activator="{ on }")
            v-btn(v-on="on") Links
          v-list
            v-list-tile(v-show="faucetUrl")
              v-list-tile-title
                a(v-bind:href="faucetUrl" target="_blank") Faucet
            v-list-tile
              v-list-tile-title
                a(v-bind:href="endpoint + '/account/' + address.plain() + '/multisig'" target="_blank") Multisig
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
