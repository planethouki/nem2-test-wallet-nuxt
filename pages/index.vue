<template lang="pug">
  v-layout(row)
    v-flex#content.pt-3.px-3
      Login
</template>

<script>
import Login from '~/components/Login.vue'

export default {
  layout: 'top',
  head() {
    return {
      meta: [
        { hid: 'top', name: 'top', content: 'top' }
      ]
    }
  },
  components: {
    Login
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    breakPoint() {
      return this.$vuetify.breakpoint.name
    }
  },
  watch: {
  },
  asyncData({ store, redirect }) {
    if (store.getters['wallet/existsAccount']) {
      redirect('/info')
    }
  },
  methods: {}
}
</script>

<style>
  .title {
    color: #35495e;
    font-weight: bold;
  }
  .subheading {
    color: #35495e;
    font-weight: bold;
  }
</style>
