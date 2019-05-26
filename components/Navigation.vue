<template lang="pug">
  v-navigation-drawer(v-model="drawer" app)
    v-toolbar(flat)
      v-list
        v-list-tile
          v-list-tile-title.title Menu
    v-list(dense)
      v-list-tile(to="/info")
        v-list-tile-action
          v-icon offline_bolt
        v-list-tile-content
          v-list-tile-title Account Info
      v-list-tile(to="/transaction")
        v-list-tile-action
          v-icon offline_bolt
        v-list-tile-content
          v-list-tile-title Send Transaction
    v-divider
    WalletInfo
    v-layout(justify-center).mt-3
      Logout
    v-layout.mt-3
      v-flex(justify-center)
        .text-xs-center
          a.github-button(href="https://github.com/planethouki/nem2-unsafe-wallet-nuxt" data-size="normal" data-show-count="true" aria-label="Star planethouki/nem2-unsafe-wallet-nuxt on GitHub") Star
          script(async defer src="https://buttons.github.io/buttons.js")
</template>

<script>
import Logout from '~/components/Logout.vue'
import WalletInfo from '~/components/WalletInfo.vue'

export default {
  name: 'Navigation',
  components: {
    Logout,
    WalletInfo
  },
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.getters.drawer
      },
      set(value) {
        this.$store.commit('setDrawer', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
