<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title.pb-0
        v-layout(align-baseline)
          span.title Address
          v-btn(
          fab
          small
          flat
          @click="copyWalletAddressHandler")
            v-icon filter_none
      v-card-text.pt-0
        v-layout(overflow-hidden)
          v-list
            v-list-tile
              v-list-tile-content
                v-list-tile-title(ref="address") {{ wallet.address.pretty() }}
                v-list-tile-sub-title {{ wallet.address.plain() }}
      v-card-title.pb-0
        v-layout(align-baseline)
          span.title Public Key
          v-btn(
          fab
          small
          flat
          @click="reloadAccount")
            v-icon cached
      v-card-text.pt-0
        v-layout(overflow-hidden)
          v-list-tile
            v-list
              v-list-tile-content
                v-list-tile-sub-title {{ publicKey }}
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
            v-list-tile
              v-list-tile-title
                a(v-bind:href="faucetUrl" v-show="faucetUrl" target="_blank") Faucet
            v-list-tile
              v-list-tile-title
                a(v-bind:href="endpoint + '/account/' + wallet.address.plain() + '/multisig'" target="_blank") Multisig
      v-card-text(v-show="alert")
        v-alert(type="error" :value="alert") {{ alert }}
</template>

<script>

import { AccountHttp } from 'nem2-sdk'

export default {
  name: 'WalletInfo',
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId',
    'faucetUrl'
  ],
  data() {
    return {
      publicKey: '',
      alert: ''
    }
  },
  watch: {
    wallet: {
      handler: function () {
        if (this.wallet.address) {
          this.alert = ''
          this.reloadAccount()
        }
      }
    }
  },
  methods: {
    logoutWallet: function (event) {
      this.$emit('logoutWallet')
    },
    copyWalletAddressHandler: function (event) {
      const target = this.$refs.address
      const range = document.createRange()
      range.selectNode(target)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    },
    reloadAccount: function (event) {
      if (this.wallet.address) {
        this.mosaics = []
        this.publicKey = ''
        const endpoint = this.endpoint
        const address = this.wallet.address
        const accountHttp = new AccountHttp(endpoint)
        accountHttp.getAccountInfo(address).subscribe(
          (accountInfo) => {
            this.publicKey = accountInfo.publicKey
          },
          (error) => {
            if (error.toString().includes('Error: Not Found')) {
              this.publicKey = '0000000000000000000000000000000000000000000000000000000000000000'
            } else {
              this.alert = error
            }
          }
        )
      }
    }
  }
}
</script>

<style scoped>

</style>
