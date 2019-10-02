<template>
  <v-app>
    <v-toolbar color="indigo" dark app>
      <v-toolbar-title>Catapult Account Interface (Elephant)</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container class="pa-0" fluid fill-height="true">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  data: () => ({

  }),
  methods: {
    toggleNav() {
      this.$store.commit('toggleDrawer')
    }
  }
}
</script>
