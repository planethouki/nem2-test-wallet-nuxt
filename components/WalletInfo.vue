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
              span.caption
                a(v-bind:href="faucetUrl" target="_blank" v-show="faucetUrl") Get XEM
            v-spacer
            v-btn(
              fab
              small
              flat
              @click="reloadMosaics")
              v-icon cached
          v-layout(column)
            v-list-tile(v-for="m in mosaicAmountTexts" v-bind:key="m")
              v-list-tile-content
                v-list-tile-title
                  span {{ m }}
      v-card-actions
        v-btn(
        color="blue"
        class="white--text"
        @click="logoutWallet") logout
      v-card-text
        v-alert(type="error" :value="alert") {{ alert }}
</template>

<script>

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
      mosaicAmountViews: [],
      publicKey: '',
      alert: ''
    }
  },
  computed: {
    mosaicAmountTexts: function () {
      return this.mosaicAmountViews.map(function (mosaicAmountView) {
        const divisibility = mosaicAmountView.mosaicInfo.properties.divisibility
        const amount = mosaicAmountView.amount.compact()
        const relAmount = amount / (10 ** divisibility)
        return mosaicAmountView.namespaceName +
            ':' +
            mosaicAmountView.mosaicName +
            '::' +
            amount.toString(10) +
            ' (' +
            relAmount.toString(10) +
            ') '
      })
    }
  },
  watch: {
    wallet: {
      handler: function () {
        if (this.wallet.address) {
          this.alert = ''
          this.reloadMosaics()
          const accountHttp = new AccountHttp(this.endpoint)
          accountHttp.getAccountInfo(this.wallet.address).subscribe(
            (accountInfo) => {
              this.publicKey = accountInfo.publicKey
            },
            () => {
              this.publicKey = ''
            }
          )
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
    reloadMosaics: function (event) {
      if (this.wallet.address) {
        this.mosaicAmountViews = []
        const endpoint = this.endpoint
        const address = this.wallet.address
        const accountHttp = new AccountHttp(endpoint)
        const mosaicHttp = new MosaicHttp(endpoint)
        const nameSpaceHttp = new NamespaceHttp(endpoint)
        const mosaicService = new MosaicService(accountHttp, mosaicHttp, nameSpaceHttp)
        accountHttp.getAccountInfo(address).subscribe(
          (accountInfo) => {
            const mosaics = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [XEM.createAbsolute(0)]
            mosaicService.mosaicsAmountView(mosaics)
              .pipe(flatMap(_ => _))
              .subscribe((mosaicAmountView) => { this.mosaicAmountViews.push(mosaicAmountView) })
          },
          (error) => {
            if (!error.message.includes('Not Found')) {
              this.alert = error.message
            }
            mosaicService.mosaicsAmountView([XEM.createAbsolute(0)])
              .pipe(flatMap(_ => _))
              .subscribe((mosaicAmountView) => { this.mosaicAmountViews.push(mosaicAmountView) })
          }
        )
      }
    }
  }
}
</script>

<style scoped>

</style>
