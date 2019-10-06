<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" lang="pug">
  v-app
    v-app-bar(color="indigo" dark app)
      v-toolbar-title Catapult Transaction Interface (Fushicho)
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
        TheWallet
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
import TransactionListener from '~/components/TheTransactionListener.vue'
import TheRestLink from '~/components/TheRestLink.vue'
import TheWallet from '~/components/TheWallet.vue'

export default {
  middleware: 'checkLogin',
  components: {
    TransactionListener,
    TheRestLink,
    TheWallet
  },
  data: () => ({
    restLinkMenu: false,
    settingMenu: false,
    logoutMenu: false
  }),
  methods: {
    logoutWallet (event) {
      this.$router.push('/logout')
    }
  }
}
</script>
