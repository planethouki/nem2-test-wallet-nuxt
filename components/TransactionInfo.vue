<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Recent Transactions
      v-card-text
        table.pl-3(style="width:100%;")
          thead
            tr
              th.text-xs-left Height
              th.text-xs-left Hash
              th.text-xs-left Type
          tbody
            template(v-for="t in confirmedTransactions")
              tr(:key="t.transactionInfo.id")
                td {{ t.transactionInfo.height.compact() }}
                td
                  a(:href="endpoint + '/transaction/' + t.transactionInfo.hash" target="_blank")
                    span.hidden-sm-and-up {{ t.transactionInfo.hash.substr(0, 8) }}...
                    span.hidden-xs-only.hidden-md-and-up {{ t.transactionInfo.hash.substr(0, 8) }}...{{ t.transactionInfo.hash.substr(-8) }}
                    span.hidden-sm-and-down {{ t.transactionInfo.hash }}
                td {{ typeToName(t.type) }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TransactionInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'transactionInfo'
      }
    }
  },
  data() {
    return {
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
    typeToName(type) {
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
