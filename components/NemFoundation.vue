<template lang="pug">
  v-flex(v-bind:id="navTargetId" xs12 mb-5)
    v-card
      v-card-title
        v-flex(colmun)
          header.display-1 NF Catapult Testnet Beta
          p.blue-grey--text.text--darken-3 Welcome to the Nem Foundation Catapult Test Net
      v-card-text
        v-btn(slot="activator" color="indigo lighten-2" dark href="https://forum.nem.io/t/guide-to-using-nf-catapult-testnet-beta-wallet/22045" target="_blank")
          span.white--text.mr-1 View Guide
          v-icon play_circle_outline
        v-btn(slot="activator" color="indigo lighten-2" dark href="http://docs.nem.io/en/testnet" target="_blank")
          span.white--text.mr-1 View Docs
          v-icon play_circle_outline
        v-btn(slot="activator" color="indigo lighten-2" dark href="http://nf-catapult-testnet.herokuapp.com/" target="_blank")
          span.white--text.mr-1 Faucet
          v-icon play_circle_outline
        v-btn(slot="activator" color="indigo lighten-2" dark href="http://3.17.139.170:8080/" target="_blank")
          span.white--text.mr-1 Network Explorer
          v-icon play_circle_outline
</template>

<script>

export default {
  name: 'NemFoundation',
  components: {
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'nemFoundation'
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.v-btn + .v-btn {
  margin-left: 1rem;
}
</style>
