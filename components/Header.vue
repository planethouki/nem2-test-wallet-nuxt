<template>
  <header>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile v-show="!existsAccount">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Please Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-for="n in nav"
          v-show="existsAccount"
          :key="n.title"
          :class="active === n.target ? 'indigo lighten-5' : ''"
          @click="$vuetify.goTo(n.target, {offset: n.offset})">
          <v-list-tile-action>
            <v-icon>{{ n.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ n.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Catapult Account Interface</v-toolbar-title>
    </v-toolbar>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    nav: {
      type: Array,
      default() {
        return []
      }
    },
    active: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    }
  }
}
</script>

<style scoped>

</style>
