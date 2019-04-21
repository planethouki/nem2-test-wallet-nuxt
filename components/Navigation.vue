<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            Pages
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-list dense>
      <v-list-tile
        to="/"
      >
        <v-list-tile-action>
          <v-icon>offline_bolt</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Send Transaction</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        to="/info"
      >
        <v-list-tile-action>
          <v-icon>offline_bolt</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Account Info</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
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
