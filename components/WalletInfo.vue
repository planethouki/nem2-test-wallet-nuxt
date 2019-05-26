<template lang="pug">
  v-list(dense three-line v-if="isShow").py-3
    v-list-tile
      v-list-tile-content
        v-list-tile-title Endpoint
        v-list-tile-sub-title(ref="endpoint") {{ endpoint }}
    v-list-tile
      v-list-tile-content
        v-list-tile-title Address
        v-list-tile-sub-title(ref="address") {{ address.pretty() }}
    v-list-tile
      v-list-tile-content
        v-list-tile-title Public Key
        v-list-tile-sub-title(ref="publicKey") {{ publicKey }}

  //-
    v-flex(mb-5 v-if="isShow" v-bind:id="navTargetId")
      v-card
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
        v-card-text(v-show="alert")
          v-alert(type="error" :value="alert") {{ alert }}
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
      isShow: 'existsAccount',
      address: 'address',
      endpoint: 'endpoint',
      publicAccount: 'publicAccount'
    }),
    publicKey() {
      return this.publicAccount.publicKey
    }
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
