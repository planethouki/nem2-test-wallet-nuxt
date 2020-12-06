<template>
  <v-list subheader>
    <v-subheader>History</v-subheader>
    <v-list-item v-for="tx in history" :key="tx.hash">
      <v-list-item-content>
        <a :href="tx.apiStatusUrl" target="_blank">{{ tx.hash }}</a>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'TxHistory',
  props: {
    history: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped>
</style>
