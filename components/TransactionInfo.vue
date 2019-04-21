<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title.pb-0
        span.title Unconfirmed
      v-card-text
        v-layout(justify-space-between)
          v-flex: strong Hash
          v-flex(text-xs-right): strong Type
        v-layout(v-for="t in unconfirmedTransactions" :key="t.transactionInfo.id" justify-space-between)
          v-flex {{ t.transactionInfo.hash }}
          v-flex(text-xs-right) {{ typeToName(t.type) }}
      v-card-title.pb-0
        span.title Aggregate Bonded
      v-card-text
        v-layout(justify-space-between)
          v-flex: strong Hash
          v-flex(text-xs-right): strong Type
        v-layout(v-for="t in aggregateBondedTransactions" :key="t.transactionInfo.id" justify-space-between)
          v-flex {{ t.transactionInfo.hash }}
          v-flex(text-xs-right) {{ typeToName(t.type) }}
      v-card-title.pb-0
        span.title Confirmed
      v-card-text
        v-layout(justify-space-between)
          v-flex: strong Height
          v-flex: strong Hash
          v-flex(text-xs-right): strong Type
        v-layout(v-for="t in confirmedTransactions" :key="t.transactionInfo.id" justify-space-between)
          v-flex {{ t.transactionInfo.height.compact() }}
          v-flex {{ t.transactionInfo.hash }}
          v-flex(text-xs-right) {{ typeToName(t.type) }}
</template>

<script>
import { AccountHttp, Listener } from 'nem2-sdk'

export default {
  name: 'TransactionInfo',
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'wallet'
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
        unconfirmedAdded: null
      }
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    },
    address() {
      return this.$store.getters['wallet/getAddress']
    },
    endpoint() {
      return this.$store.getters['wallet/getEndpoint']
    },
    faucetUrl() {
      return this.$store.getters['wallet/getFaucet']
    },
    publicAccount() {
      return this.$store.getters['wallet/getPublicAccount']
    }
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
