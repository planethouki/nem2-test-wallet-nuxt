<template lang="pug">
  div
</template>

<script>
export default {
  components: {},
  layout: 'login',
  data () {
    return {}
  },
  mounted () {
    this.logout()
  },
  methods: {
    logout () {
      this.$store.dispatch('wallet/logout')
      this.$router.push('/login')
    }
  }
}
</script>
