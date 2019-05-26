<template lang="pug">
  div.pa-3
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
  }
}
</script>

<style scoped>
.hover:hover > span {
  color: #3F51B5;
}
</style>
