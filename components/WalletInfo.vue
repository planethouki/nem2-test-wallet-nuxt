<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        v-flex
          v-layout(align-baseline)
            span.title Address
            v-btn(
            fab
            small
            flat
            @click="copyWalletAddressHandler")
              v-icon filter_none
          v-layout(overflow-hidden)
            v-list
              v-list-tile
                v-list-tile-content
                  v-list-tile-title(ref="address") {{ wallet.address.pretty() }}
                  v-list-tile-sub-title {{ wallet.address.plain() }}
      v-card-title
        v-flex
          v-layout(align-baseline)
            span.title Public Key
          v-layout(overflow-hidden)
          v-list-tile
            v-list
              v-list-tile-content
                v-list-tile-sub-title {{ publicKey }}
      v-card-title
        v-flex
          v-layout(align-baseline)
            div
              span.title Mosaics
          v-layout(column)
            v-list-tile(v-for="m in mosaicTexts" v-bind:key="m")
              v-list-tile-content
                v-list-tile-title
                  span {{ m }}
      v-card-actions
        v-btn(
        color="blue"
        class="white--text"
        @click="reloadAccount")
          v-icon cached
        v-btn(
        color="blue"
        class="white--text"
        v-show="faucetUrl"
        v-bind:href="faucetUrl"
        target="_blank" ) Faucet
        v-spacer
        v-btn(
        color="pink"
        class="white--text"
        @click="logoutWallet") logout
      v-card-text(v-show="alert")
        v-alert(type="error" :value="alert") {{ alert }}
</template>

<script>
/* eslint-disable */

import { AccountHttp, XEM, MosaicHttp, NamespaceHttp, MosaicService } from 'nem2-sdk'
import { flatMap } from 'rxjs/operators'

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
      mosaics: [],
      publicKey: '',
      alert: ''
    }
  },
  computed: {
    mosaicTexts: function () {
      return this.mosaics.length === 0 ? ["empty"] : this.mosaics.map(function (mosaic) {
        return mosaic.id.id.toHex().toUpperCase() +
            '::' +
            mosaic.amount.compact()
      })
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
        this.publicKey = ""
        const endpoint = this.endpoint
        const address = this.wallet.address
        const accountHttp = new AccountHttp(endpoint)
        accountHttp.getAccountInfo(address).subscribe(
          (accountInfo) => {
            this.publicKey = accountInfo.publicKey
            this.mosaics = accountInfo.mosaics
          },
          (error) => {
            if (error.toString().includes("Error: Not Found")) {
              this.publicKey = "0000000000000000000000000000000000000000000000000000000000000000"
              this.mosaics = []
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
