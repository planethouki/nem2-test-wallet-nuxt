<template>
  <div>
    <v-app>
      <v-app-bar color="indigo" dark>
        <v-toolbar-title>Catapult Account Interface</v-toolbar-title>
      </v-app-bar>
      <v-content>
        <v-container fill-height>
          <nuxt />
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>

export default {
  data: () => ({

  }),
  methods: {
    toggleNav () {
      this.$store.commit('toggleDrawer')
    }
  }
}
</script>
