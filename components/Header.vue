<template>
  <header>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile v-show="!wallet.address">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Please Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-show="wallet.address"
          v-for="n in nav"
          v-bind:key="n.title"
          v-on:click="$vuetify.goTo(n.target, {offset: n.offset})">
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
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Catapult Account Interface</v-toolbar-title>
    </v-toolbar>
  </header>
</template>

<script>
    export default {
      name: "Header",
      props: [
        "wallet",
        "nav"
      ],
      data() {
        return {
          drawer: false,
        }
      }
    }
</script>

<style scoped>

</style>
