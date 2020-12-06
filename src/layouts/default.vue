<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" lang="pug">
  v-app
    v-app-bar(color="indigo" dark app)
      v-toolbar-title Catapult Transaction Interface ({{ mileStone }})
      v-spacer
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
            div.headline.pa-3 Logout?
            v-btn(
              color="pink"
              class="white--text"
              @click="logoutWallet") OK
    v-content
      v-container(fluid fill-height)
        nuxt
    TransactionListener
</template>

<script>
import { mapGetters } from 'vuex'
import TheWallet from '~/components/TheWallet.vue'

export default {
  components: {
    TheWallet
  },
  middleware: 'checkLogin',
  data: () => ({
    restLinkMenu: false,
    settingMenu: false,
    logoutMenu: false
  }),
  computed: {
    ...mapGetters('env', [
      'mileStone'
    ])
  },
  methods: {
    logoutWallet (event) {
      this.$router.push('/logout')
    }
  }
}
</script>
