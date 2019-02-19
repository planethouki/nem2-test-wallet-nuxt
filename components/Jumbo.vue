<template lang="pug">
  v-flex(mb-5 v-bind:id="navTargetId")
    v-card
      v-card-title.d-block
        header.display-1 NF Catapult Testnet Beta
        p.blue-grey--text.text--darken-3 Welcome to the Nem Foundation Catapult Test Net


        v-btn(slot="activator" color="indigo lighten-2" dark href="https://forum.nem.io/t/guide-to-using-nf-catapult-testnet-beta-wallet/22045" target="_blank").white--text View Guide
          v-icon play_circle_outline

</template>

<script>

  import Tutorial from '~/components/Tutorial.vue'

  export default {
    components: {
      Tutorial
    },
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
