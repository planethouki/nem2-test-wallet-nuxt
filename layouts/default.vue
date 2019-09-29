<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" lang="pug">
  v-app
    v-app-bar(color="indigo" dark app)
      v-toolbar-title Catapult Account Interface
      v-spacer
      v-menu(
        v-model="restLinkMenu"
        :close-on-content-click="false"
        offset-y)
        template(v-slot:activator="{ on }")
          v-btn(
            icon
            v-on="on")
            v-icon usb
        TheRestLink
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
          div(style="opacity:0;position:absolute;font-size:0px;" ref="endpoint") {{ endpoint }}
          div(style="opacity:0;position:absolute;font-size:0px;" ref="address") {{ address.pretty() }}
          div(style="opacity:0;position:absolute;font-size:0px;" ref="publicKey") {{ publicAccount.publicKey }}
          div(style="opacity:0;position:absolute;font-size:0px;" ref="privateKey") {{ privateKey }}
          v-list(dense two-line)
            v-list-item(v-if="endpoint")
              v-list-item-content
                v-list-item-title Endpoint
                v-list-item-subtitle {{ endpoint }}
              v-list-item-action
                v-btn(
                  fab
                  small
                  @click="copyEndpointHandler")
                  v-icon filter_none
            v-list-item(v-if="address")
              v-list-item-content
                v-list-item-title Address
                v-list-item-subtitle {{ address.pretty() }}
              v-list-item-action
                v-btn(
                  fab
                  small
                  @click="copyAddressHandler")
                  v-icon filter_none
            v-list-item(v-if="publicAccount")
              v-list-item-content
                v-list-item-title Public Key
                v-list-item-subtitle {{ publicAccount.publicKey }}
              v-list-item-action
                v-btn(
                  fab
                  small
                  @click="copyPublicKeyHandler")
                  v-icon filter_none
            v-list-item(v-if="account")
              v-list-item-content
                v-list-item-title Private Key
                v-list-item-subtitle
                  span ********
              v-list-item-action
                v-btn(
                  fab
                  small
                  @click="copyPrivateKeyHandler")
                  v-icon filter_none
      v-dialog(
        v-model="logoutMenu"
        :close-on-content-click="false"
        width="500"
        offset-y)
        template(v-slot:activator="{ on }")
          v-btn(
            icon
            v-on="on")
            v-icon exit_to_app
        v-card
          v-card-text.text-center
            div.headline.pa-3 Confirm
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
import TheRestLink from '~/components/TheRestLink.vue'

export default {
  middleware: 'checkLogin',
  components: {
    TransactionListener,
    TheRestLink
  },
  data: () => ({
    restLinkMenu: false,
    settingMenu: false,
    logoutMenu: false,
    privateKey: null
  }),
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
    },
    logoutWallet (event) {
      this.$router.push('/logout')
    }
  }
}
</script>
