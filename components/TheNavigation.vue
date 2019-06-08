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
    v-layout.mt-3
      v-flex(justify-center)
        .text-xs-center
          a.github-button(href="https://github.com/planethouki/nem2-unsafe-wallet-nuxt" data-size="normal" data-show-count="true" aria-label="Star planethouki/nem2-unsafe-wallet-nuxt on GitHub") Star
          script(async defer src="https://buttons.github.io/buttons.js")
</template>

<script>
export default {
  name: 'Navigation',
  components: {
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
  },
  methods: {
  }
}
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.break {
  word-break: break-all;
}
</style>
