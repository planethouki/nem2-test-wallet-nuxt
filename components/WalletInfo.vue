<template lang="pug">
  v-list(dense three-line).py-3
    v-list-tile(v-if="endpoint")
      v-list-tile-content
        v-list-tile-title Endpoint
        v-list-tile-sub-title(ref="endpoint") {{ endpoint }}
    v-list-tile(v-if="address")
      v-list-tile-content
        v-list-tile-title Address
        v-list-tile-sub-title(ref="address") {{ address.pretty() }}
    v-list-tile(v-if="publicAccount")
      v-list-tile-content
        v-list-tile-title Public Key
        v-list-tile-sub-title(ref="publicAccount") {{ publicAccount.publicKey }}
</template>

<script>
import { mapGetters } from 'vuex'

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
    ...mapGetters('wallet', {
      address: 'address',
      endpoint: 'endpoint',
      publicAccount: 'publicAccount'
    })
  },
  watch: {
  },
  methods: {
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
