<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Recent Transactions
      v-card-text
        span.subheading Unconfirmed
        table.pl-3(style="width:100%;")
          thead
            tr
              th.text-xs-left Hash
              th.text-xs-left Type
          tbody
            template(v-for="t in unconfirmedTransactions")
              tr(:key="t.transactionInfo.id")
                td
                  a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
                    span.hidden-sm-and-up {{ t.transactionInfo.hash.substr(0, 8) }}...
                    span.hidden-xs-only.hidden-md-and-up {{ t.transactionInfo.hash.substr(0, 8) }}...{{ t.transactionInfo.hash.substr(-8) }}
                    span.hidden-sm-and-down {{ t.transactionInfo.hash }}
                td {{ typeToName(t.type) }}
      v-card-text
        span.subheading Aggregate Bonded
        table.ml-3(style="width:100%;")
          thead
            tr
              th.text-xs-left Hash
              th.text-xs-left Type
          tbody
            template(v-for="t in aggregateBondedTransactions")
              tr(:key="t.transactionInfo.id")
                td
                  a(:href="endpoint + '/transaction/' + t.transactionInfo.hash + '/status'" target="_blank")
                    span.hidden-sm-and-up {{ t.transactionInfo.hash.substr(0, 8) }}...
                    span.hidden-xs-only.hidden-md-and-up {{ t.transactionInfo.hash.substr(0, 8) }}...{{ t.transactionInfo.hash.substr(-8) }}
                    span.hidden-sm-and-down {{ t.transactionInfo.hash }}
                td {{ typeToName(t.type) }}
      v-card-text
        span.subheading Confirmed
        table.ml-3(style="width:100%;")
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
import { AccountHttp, Listener } from 'nem2-sdk'

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
      listener: null,
      unconfirmedTransactions: [],
      confirmedTransactions: [],
      aggregateBondedTransactions: [],
      subscriptions: {
        confirmed: null,
        unconfirmedAdded: null,
        aggregateBondedAdded: null
      }
    }
  },
  computed: {
    ...mapGetters('wallet', {
      existsAccount: 'existsAccount',
      address: 'address',
      endpoint: 'endpoint',
      publicAccount: 'publicAccount'
    })
  },
  watch: {
    endpoint(newVal) {
      if (newVal) {
        this.changeListener(newVal)
      }
    }
  },
  mounted() {
    if (this.endpoint) {
      this.changeListener(this.endpoint)
    }
  },
  destroyed() {
    this.closeListener()
  },
  methods: {
    closeListener() {
      if (this.listener) {
        if (this.listener.isOpen()) {
          this.listener.close()
          this.listener = null
        }
      }
    },
    async changeListener(endpoint) {
      if (this.listener) {
        if (this.listener.isOpen()) {
          this.listener.close()
          // eslint-disable-next-line
          console.log('connection close')
        }
      }
      const wsEndpoint = endpoint.replace('http', 'ws')
      this.listener = new Listener(wsEndpoint, WebSocket)
      await this.listener.open()
      this.getUnconfirmedTransactions()
      this.getAggregateBondedTransactions()
      this.getConfirmedTransactions()
    },
    getUnconfirmedTransactions() {
      const endpoint = this.endpoint
      const publicAccount = this.publicAccount
      const accountHttp = new AccountHttp(endpoint, publicAccount.address.networkType)
      accountHttp.unconfirmedTransactions(publicAccount).subscribe((transactions) => {
        this.unconfirmedTransactions = transactions
      })
      if (this.subscriptions.unconfirmedAdded) {
        this.subscriptions.unconfirmedAdded.unsubscribe()
        this.subscriptions.unconfirmedAdded = null
      }
      if (this.subscriptions.unconfirmedRemoved) {
        this.subscriptions.unconfirmedRemoved.unsubscribe()
        this.subscriptions.unconfirmedRemoved = null
      }
      this.subscriptions.unconfirmedAdded = this.listener.unconfirmedAdded(this.address).subscribe((transaction) => {
        this.unconfirmedTransactions.splice(0, 0, transaction)
      })
      this.subscriptions.unconfirmedRemoved = this.listener.unconfirmedRemoved(this.address).subscribe((transaction) => {
        const index = this.unconfirmedTransactions.findIndex((element) => {
          return transaction === element.transactionInfo.hash
        })
        if (index > -1) {
          this.unconfirmedTransactions.splice(index, 1)
        }
      })
    },
    getAggregateBondedTransactions() {
      const endpoint = this.endpoint
      const publicAccount = this.publicAccount
      const accountHttp = new AccountHttp(endpoint, publicAccount.address.networkType)
      accountHttp.aggregateBondedTransactions(publicAccount).subscribe((transactions) => {
        this.aggregateBondedTransactions = transactions
      })
      if (this.subscriptions.aggregateBondedAdded) {
        this.subscriptions.aggregateBondedAdded.unsubscribe()
        this.subscriptions.aggregateBondedAdded = null
      }
      if (this.subscriptions.aggregateBondedRemoved) {
        this.subscriptions.aggregateBondedRemoved.unsubscribe()
        this.subscriptions.aggregateBondedRemoved = null
      }
      this.subscriptions.aggregateBondedAdded = this.listener.aggregateBondedAdded(this.address).subscribe((transaction) => {
        this.aggregateBondedTransactions.splice(0, 0, transaction)
      })
      this.subscriptions.aggregateBondedRemoved = this.listener.aggregateBondedRemoved(this.address).subscribe((transaction) => {
        const index = this.aggregateBondedTransactions.findIndex((element) => {
          return transaction === element.transactionInfo.hash
        })
        if (index > -1) {
          this.aggregateBondedTransactions.splice(index, 1)
        }
      })
    },
    getConfirmedTransactions() {
      const endpoint = this.endpoint
      const publicAccount = this.publicAccount
      const accountHttp = new AccountHttp(endpoint, publicAccount.address.networkType)
      accountHttp.transactions(publicAccount).subscribe((transactions) => {
        this.confirmedTransactions = transactions
      })
      if (this.subscriptions.confirmed) {
        this.subscriptions.confirmed.unsubscribe()
        this.subscriptions.confirmed = null
      }
      this.subscriptions.confirmed = this.listener.confirmed(this.address).subscribe((transaction) => {
        this.confirmedTransactions.splice(0, 0, transaction)
      })
    },
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
