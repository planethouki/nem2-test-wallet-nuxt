<template>
  <v-list subheader>
    <v-subheader>History</v-subheader>
    <v-list-item v-for="tx in history" :key="tx.hash">
      <v-list-item-content>
        <v-list-item-title>
          Aggregate: <a :href="tx.agApiStatusUrl" target="_blank">{{ tx.agHash }}</a>
        </v-list-item-title>
        <v-list-item-subtitle>
          LockFunds: <a :href="tx.lfApiStatusUrl" target="_blank">{{ tx.lfHash }}</a>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
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
