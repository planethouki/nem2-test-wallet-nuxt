<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Recent Transactions
      v-card-text
        v-data-table(
          :headers="headers"
          :items="confirmedTransactions")
          template(v-slot:items="props")
            td
              a(:href="endpoint + '/block/' + props.item.transactionInfo.height.compact()" target="_blank")
                span {{ props.item.transactionInfo.height.compact() }}
            td
              a(:href="endpoint + '/transaction/' + props.item.transactionInfo.hash" target="_blank")
                span {{ props.item.transactionInfo.hash }}
            td {{ typeToName(props.item.type) }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TransactionInfo',
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'transactionInfo'
      }
    }
  },
  data () {
    return {
      headers: [
        { text: 'Height', value: 'height' },
        { text: 'Hash', value: 'hash' },
        { text: 'Type', value: 'type' }
      ]
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAccount',
      'publicAccount',
      'endpoint'
    ]),
    ...mapGetters('transactions', [
      'confirmedTransactions'
    ])
  },
  methods: {
    typeToName (type) {
      const withLabel = this.$transactionTypes.find((x) => {
        return x.entityType === type
      })
      return withLabel ? withLabel.label : undefined
    }

  }
}
</script>

<style scoped>
</style>
