<template>
  <v-list subheader>
    <v-subheader>History</v-subheader>
    <v-list-tile v-for="tx in history" :key="tx.hash">
      <v-list-tile-content>
        <a :href="tx.apiStatusUrl" target="_blank">{{ tx.hash }}</a>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  name: 'TxHistory',
  props: {
    history: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
