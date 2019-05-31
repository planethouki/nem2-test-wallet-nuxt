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
    v-list(dense two-line)
      v-list-tile(v-if="endpoint")
        v-list-tile-content
          v-list-tile-title Endpoint
          v-list-tile-sub-title(ref="endpoint") {{ endpoint }}
      v-list-tile(v-if="address")
        v-list-tile-content
          v-list-tile-title Address
          v-list-tile-sub-title(ref="address") {{ address.pretty() }}
      v-list-tile(v-if="publicAccount")
        v-list-tile-content
          v-list-tile-title Public Key
          v-list-tile-sub-title(ref="publicAccount") {{ publicAccount.publicKey }}
    v-divider
    v-layout(column).py-1
      div.pl-3.mb-2
        div.body-2 Unconfirmed
        div(v-for="t in unconfirmedTransactions").ellipsis
          a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
            span.caption {{ t.transactionInfo.hash }}
      div.pl-3.mb-2
        div.body-2 AggregateBonded
        div(v-for="t in aggregateBondedTransactions").ellipsis
          a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
            span.caption {{ t.transactionInfo.hash }}
    v-divider
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
import { mapGetters } from 'vuex'

export default {
  name: 'Navigation',
  components: {
    Logout
  },
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'address',
      'endpoint',
      'publicAccount'
    ]),
    ...mapGetters('transactions', [
      'unconfirmedTransactions',
      'aggregateBondedTransactions'
    ]),
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
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
