<template lang="pug">
  v-btn(
  color="pink"
  class="white--text"
  @click="logoutWallet") logout
</template>

<script>
export default {
  name: 'Logout',
  methods: {
    logoutWallet: function (event) {
      this.$store.dispatch('wallet/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
