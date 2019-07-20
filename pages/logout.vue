<template lang="pug">
  div
</template>

<script>
export default {
  layout: 'login',
  components: {},
  data() {
    return {}
  },
  mounted: function () {
    this.logout()
  },
  methods: {
    logout() {
      const account = this.$store.getters['wallet/account']
      this.$store.dispatch('env/logout', { account })
      this.$store.dispatch('wallet/logout')
      this.$router.push('/login')
    }
  }
}
</script>
