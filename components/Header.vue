<template>
  <header>
    <v-toolbar color="indigo" dark app>
      <v-toolbar-side-icon @click.stop="toggleNav" class="hidden-lg-and-up" />
      <v-toolbar-title>Catapult Account Interface</v-toolbar-title>
    </v-toolbar>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
  },
  data() {
    return {}
  },
  computed: {
  },
  methods: {
    toggleNav() {
      this.$store.commit('toggleDrawer')
    }
  }
}
</script>

<style scoped>

</style>
