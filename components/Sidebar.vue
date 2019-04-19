<template lang="pug">
  div.pa-3
    v-list(dense v-show="!existsAccount")
      v-list-tile
        v-list-tile-action
          v-icon info
        v-list-tile-content
          v-list-tile-title Please Login
    div(v-show="existsAccount")
      div.py-1.hover(
        v-for="n in nav"
        style="cursor: pointer;"
        @click="$vuetify.goTo(n.target, {offset: n.offset})"
        :key="n.title"
        :class="active === n.target ? 'indigo lighten-5 indigo--text' : 'grey--text'")
        v-icon.mr-1(small) {{ n.icon }}
        span {{ n.title }}
</template>

<script>
export default {
  name: 'Sidebar',
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
.hover:hover > span {
  color: #3F51B5;
}
</style>
