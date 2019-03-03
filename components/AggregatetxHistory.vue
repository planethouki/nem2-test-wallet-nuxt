<template>
  <v-list subheader>
    <v-subheader>History</v-subheader>
    <v-list-tile v-for="tx in history" :key="tx.hash">
      <v-list-tile-avatar />
      <v-list-tile-content>
        <v-list-tile-title>
          Aggregate: <a :href="tx.agApiStatusUrl" target="_blank">{{ tx.agHash }}</a>
        </v-list-tile-title>
        <v-list-tile-sub-title>
          LockFunds: <a :href="tx.lfApiStatusUrl" target="_blank">{{ tx.lfHash }}</a>
        </v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  name: 'AggregateTxHistory',
  props: {
    history: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
