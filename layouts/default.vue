<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" lang="pug">
  v-app
    Navigation
    v-toolbar(color="indigo" dark app)
      v-toolbar-side-icon.hidden-lg-and-up(@click.stop="toggleNav")
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
            div.pl-3.mb-2
              div.body-2 AggregateBonded
              div(v-for="t in aggregateBondedTransactions").ellipsis
                a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
                  span.caption {{ t.transactionInfo.hash }}
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
            div.pl-3.mb-2
              div.body-2 Unconfirmed
              div(v-for="t in unconfirmedTransactions").ellipsis
                a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
                  span.caption {{ t.transactionInfo.hash }}
      v-menu(
        v-model="accountMenu"
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
                  flat
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
                  flat
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
                  flat
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
                  flat
                  @click="copyPrivateKeyHandler")
                  v-icon filter_none
          v-card-actions
            v-layout(justify-center)
              Logout
    v-content
      v-container.pa-0(fluid fill-height="true")
        nuxt
    TransactionListener
</template>

<script>
import { mapGetters } from 'vuex'
import Navigation from '~/components/TheNavigation.vue'
import TransactionListener from '~/components/TheTransactionListener.vue'
import Logout from '~/components/Logout.vue'

export default {
  components: {
    Navigation,
    TransactionListener,
    Logout
  },
  data: () => ({
    accountMenu: false,
    unconfirmedMenu: false,
    partialMenu: false,
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
    unconfirmedBadge() {
      if (!this.unconfirmedTransactions) return false
      return this.unconfirmedTransactions.length > 0
    },
    partialBadge() {
      if (!this.aggregateBondedTransactions) return false
      return this.aggregateBondedTransactions.length > 0
    },
    unconfirmedCount() {
      if (!this.unconfirmedTransactions) return 0
      return this.unconfirmedTransactions.length
    },
    partialCount() {
      if (!this.aggregateBondedTransactions) return 0
      return this.aggregateBondedTransactions.length
    }
  },
  methods: {
    toggleNav() {
      this.$store.commit('toggleDrawer')
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
    },
    copyPrivateKeyHandler: function (event) {
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
