<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" lang="pug">
  v-app
    v-app-bar(color="indigo" dark app)
      v-toolbar-title Catapult Account Interface
      v-spacer
      v-menu(
        v-model="partialMenu"
        :close-on-content-click="false"
        offset-y)
        template(v-slot:activator="{ on }")
          v-btn(icon v-on="on")
            v-badge(left overwrap v-model="partialBadge")
              template(v-slot:badge) {{ partialCount }}
              | P
        v-card(style="width: 250px;")
          v-layout(column).py-1
            div.px-3.mb-2
              div.body-2 AggregateBonded
              div(v-for="t in aggregateBondedTransactions").ellipsis
                a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
                  span.caption {{ t.transactionInfo.hash }}
              div(v-show="aggregateBondedTransactions.length === 0") None
      v-menu(
        v-model="unconfirmedMenu"
        :close-on-content-click="false"
        offset-y)
        template(v-slot:activator="{ on }")
          v-btn(icon v-on="on")
            v-badge(left overwrap v-model="unconfirmedBadge")
              template(v-slot:badge) {{ unconfirmedCount }}
              | U
        v-card(style="width: 250px;")
          v-layout(column).py-1
            div.px-3.mb-2
              div.body-2 Unconfirmed
              div(v-for="t in unconfirmedTransactions").ellipsis
                a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
                  span.caption {{ t.transactionInfo.hash }}
              div(v-show="unconfirmedTransactions.length === 0") None
      v-menu(
        v-model="accountMenu"
        :close-on-content-click="false"
        offset-y)
        template(v-slot:activator="{ on }")
          v-btn(
            icon
            v-on="on")
            v-icon account_balance_wallet
        v-card(style="width: 300px;")
          v-layout(column).py-1
            div.px-3.mb-2
              div.body-2 Mosaic Balance
              div(v-for="m in mosaicBalance" v-bind:key="m.id")
                span {{ m.id }}::{{ m.absoluteAmount }} ({{ m.relativeAmount }})
              div(v-show="mosaicBalance.length === 0") None
      v-menu(
        v-model="settingMenu"
        :close-on-content-click="false"
        offset-y)
        template(v-slot:activator="{ on }")
          v-btn(
            icon
            v-on="on")
            v-icon account_circle
        v-card(style="width: 300px;")
          v-list(dense two-line)
            v-list-tile(v-if="endpoint")
              v-list-tile-content
                v-list-tile-title Endpoint
                v-list-tile-sub-title(ref="endpoint") {{ endpoint }}
              v-list-tile-action
                v-btn(
                  fab
                  small
                  @click="copyEndpointHandler")
                  v-icon filter_none
            v-list-tile(v-if="address")
              v-list-tile-content
                v-list-tile-title Address
                v-list-tile-sub-title(ref="address") {{ address.pretty() }}
              v-list-tile-action
                v-btn(
                  fab
                  small
                  @click="copyAddressHandler")
                  v-icon filter_none
            v-list-tile(v-if="publicAccount")
              v-list-tile-content
                v-list-tile-title Public Key
                v-list-tile-sub-title(ref="publicKey") {{ publicAccount.publicKey }}
              v-list-tile-action
                v-btn(
                  fab
                  small
                  @click="copyPublicKeyHandler")
                  v-icon filter_none
            v-list-tile(v-if="account")
              v-list-tile-content
                v-list-tile-title Private Key
                v-list-tile-sub-title
                  span ********
                  span(style="opacity: 0;" ref="privateKey") {{ privateKey }}
              v-list-tile-action
                v-btn(
                  fab
                  small
                  @click="copyPrivateKeyHandler")
                  v-icon filter_none
      v-menu(
        v-model="logoutMenu"
        :close-on-content-click="false"
        offset-y)
        template(v-slot:activator="{ on }")
          v-btn(
            icon
            v-on="on")
            v-icon exit_to_app
        v-card(style="width: 300px;")
          v-card-actions
            v-layout(justify-center)
              v-btn(
                color="pink"
                class="white--text"
                @click="logoutWallet") logout
    v-content
      v-container(fluid fill-height)
        nuxt
    TransactionListener
</template>

<script>
import { mapGetters } from 'vuex'
import TransactionListener from '~/components/TheTransactionListener.vue'

export default {
  middleware: 'checkLogin',
  components: {
    TransactionListener
  },
  data: () => ({
    accountMenu: false,
    settingMenu: false,
    unconfirmedMenu: false,
    partialMenu: false,
    logoutMenu: false,
    privateKey: null
  }),
  computed: {
    ...mapGetters('wallet', [
      'address',
      'endpoint',
      'publicAccount',
      'account'
    ]),
    ...mapGetters('transactions', [
      'unconfirmedTransactions',
      'aggregateBondedTransactions'
    ]),
    ...mapGetters('mosaicAmountViews', [
      'mosaicAmountViews'
    ]),
    ...mapGetters('chain', [
      'blockHeight'
    ]),
    unconfirmedBadge () {
      if (!this.unconfirmedTransactions) { return false }
      return this.unconfirmedTransactions.length > 0
    },
    partialBadge () {
      if (!this.aggregateBondedTransactions) { return false }
      return this.aggregateBondedTransactions.length > 0
    },
    unconfirmedCount () {
      if (!this.unconfirmedTransactions) { return 0 }
      return this.unconfirmedTransactions.length
    },
    partialCount () {
      if (!this.aggregateBondedTransactions) { return 0 }
      return this.aggregateBondedTransactions.length
    },
    mosaicBalance () {
      const blockHeight = this.blockHeight
      if (this.isLoading === false && this.mosaicAmountViews.length === 0) {
        return []
      } else if (this.mosaicAmountViews === null) {
        return []
      }
      return this.mosaicAmountViews.filter(function (mosaicAmountView) {
        if (mosaicAmountView.mosaicInfo.duration.compact() === 0) {
          return true
        } else {
          const endHeight = mosaicAmountView.mosaicInfo.height.compact() + mosaicAmountView.mosaicInfo.duration.compact()
          return blockHeight < endHeight
        }
      }).sort(function (a, b) {
        const nameA = a.mosaicInfo.metaId
        const nameB = b.mosaicInfo.metaId
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      }).map(function (mosaicAmountView) {
        const amount = mosaicAmountView.amount.compact()
        const relAmount = mosaicAmountView.relativeAmount()
        const ret = {
          absoluteAmount: amount.toString(10),
          relativeAmount: relAmount.toString(10)
        }
        ret.id = mosaicAmountView.fullName().toUpperCase()
        return ret
      })
    }
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
    },
    logoutWallet (event) {
      this.$router.push('/logout')
    }
  }
}
</script>
