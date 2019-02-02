<template lang="pug">
  v-flex(mb-5 v-bind:id="navTargetId")
    v-card
      v-card-title.d-block
        header.display-1 NF Catapult Testnet Beta
        p.blue-grey--text.text--darken-3 Welcome to the Nem Foundation Catapult Test Net

        v-btn(color="indigo lighten-2").white--text View Tutorial
          v-icon play_circle_outline
</template>

<script>

  export default {
    name: "Jumbo",
    props: [
      "navTargetId"
    ],
    data() {
      return {

      }
    },
    watch: {
      wallet: {
        handler: function() {

        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  header {
    color: #3a3c4f;
  }
</style>
