<template lang="pug">
  v-card(style="width: 300px;")
    div.invisible
      div(ref="endpoint") {{ endpoint }}
      div(ref="address") {{ address.pretty() }}
      div(ref="publicKey") {{ publicAccount.publicKey }}
      div(ref="privateKey") {{ privateKey }}
    v-list(dense two-line)
      v-list-item(v-if="endpoint")
        v-list-item-content
          v-list-item-title Endpoint
          v-list-item-subtitle {{ endpoint }}
        v-list-item-action
          v-btn(
            icon
            x-small
            @click="copyEndpointHandler")
            v-icon(x-small) filter_none
      v-list-item(v-if="address")
        v-list-item-content
          v-list-item-title Address
          v-list-item-subtitle {{ address.pretty() }}
        v-list-item-action
          v-btn(
            icon
            x-small
            @click="copyAddressHandler")
            v-icon(x-small) filter_none
      v-list-item(v-if="publicAccount")
        v-list-item-content
          v-list-item-title Public Key
          v-list-item-subtitle {{ publicAccount.publicKey }}
        v-list-item-action
          v-btn(
            icon
            x-small
            @click="copyPublicKeyHandler")
            v-icon(x-small) filter_none
      v-list-item(v-if="account")
        v-list-item-content
          v-list-item-title Private Key
          v-list-item-subtitle
            span ****************************************************************
        v-list-item-action
          v-btn(
            icon
            x-small
            @click="copyPrivateKeyHandler")
            v-icon(x-small) filter_none
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TheWallet',
  data () {
    return {
      privateKey: null
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'address',
      'endpoint',
      'publicAccount',
      'account'
    ])
  },
  methods: {
    copyEndpointHandler (event) {
      const target = this.$refs.endpoint
      const range = document.createRange()
      range.selectNode(target)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    },
    copyAddressHandler (event) {
      const target = this.$refs.address
      const range = document.createRange()
      range.selectNode(target)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    },
    copyPublicKeyHandler (event) {
      const target = this.$refs.publicKey
      const range = document.createRange()
      range.selectNode(target)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    },
    copyPrivateKeyHandler (event) {
      this.privateKey = this.account.privateKey
      this.$nextTick(() => {
        const target = this.$refs.privateKey
        const range = document.createRange()
        range.selectNode(target)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        document.execCommand('copy')
        window.getSelection().removeAllRanges()
        this.privateKey = null
      })
    }
  }
}
</script>

<style scoped>
.invisible > div {
  opacity: 0;
  position: absolute;
  font-size: 0;
}
</style>
