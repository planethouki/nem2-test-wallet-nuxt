<template lang="pug">
  v-flex(mb-5 v-bind:id="navTargetId")
    v-card
      v-card-title
        v-layout(align-baseline)
          span.title Wallet
      v-card-text
        v-layout(column v-if="endpoint")
          div.subheading Endpoint
          v-list
            v-list-tile
              v-list-tile-content
                v-list-tile-title(ref="endpoint") {{ endpoint }}
              v-list-tile-action
                v-btn(
                  fab
                  small
                  flat
                  @click="copyEndpointHandler")
                  v-icon filter_none
        v-layout.mb-2(column v-if="address")
          div.subheading Address
          v-list
            v-list-tile
              v-list-tile-content
                v-list-tile-title(ref="address") {{ address.pretty() }}
                v-list-tile-sub-title {{ address.plain() }}
              v-list-tile-action
                v-btn(
                  fab
                  small
                  flat
                  @click="copyAddressHandler")
                  v-icon filter_none
        v-layout(column v-if="publicAccount")
          div.subheading Public Key
          v-list(subheader)
            v-list-tile
              v-list-tile-content
                v-list-tile-title(ref="publicKey") {{ publicAccount.publicKey }}
              v-list-tile-action
                v-btn(
                  fab
                  small
                  flat
                  @click="copyPublicKeyHandler")
                  v-icon filter_none
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'WalletInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'walletInfo'
      }
    }
  },
  data() {
    return {
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
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
