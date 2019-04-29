<template>
  <v-app>
    <Navigation />
    <v-toolbar color="indigo" dark app>
      <v-toolbar-side-icon class="hidden-lg-and-up" @click.stop="toggleNav" />
      <v-toolbar-title>Catapult Account Interface</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container class="pa-0" fluid fill-height="true">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from '~/components/Navigation.vue'

export default {
  components: {
    Navigation
  },
  data: () => ({

  }),
  methods: {
    toggleNav() {
      this.$store.commit('toggleDrawer')
    }
  }
}
</script>
