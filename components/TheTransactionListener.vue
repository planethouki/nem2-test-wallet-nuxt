<template lang="pug"></template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Listener } from 'nem2-sdk'

export default {
  name: 'TransactionListener',
  data() {
    return {
      listener: null,
      subscriptions: {
        confirmed: null,
        unconfirmedAdded: null,
        aggregateBondedAdded: null
      }
    }
  },
  computed: {
    ...mapGetters('wallet', {
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
    ...mapActions('transactions', [
      'unconfirmedAdded',
      'unconfirmedRemoved',
      'aggregateBondedAdded',
      'aggregateBondedRemoved',
      'confirmedAdded'
    ]),
    closeListener() {
      if (this.listener) {
        if (this.listener.isOpen()) {
          this.listener.close()
          this.listener = null
          // eslint-disable-next-line
          console.log('connection close')
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
      if (this.subscriptions.unconfirmedAdded) {
        this.subscriptions.unconfirmedAdded.unsubscribe()
        this.subscriptions.unconfirmedAdded = null
      }
      if (this.subscriptions.unconfirmedRemoved) {
        this.subscriptions.unconfirmedRemoved.unsubscribe()
        this.subscriptions.unconfirmedRemoved = null
      }
      this.subscriptions.unconfirmedAdded = this.listener.unconfirmedAdded(this.address).subscribe((transaction) => {
        this.unconfirmedAdded({ transaction })
      })
      this.subscriptions.unconfirmedRemoved = this.listener.unconfirmedRemoved(this.address).subscribe((transaction) => {
        this.unconfirmedRemoved({ transaction })
      })
    },
    getAggregateBondedTransactions() {
      if (this.subscriptions.aggregateBondedAdded) {
        this.subscriptions.aggregateBondedAdded.unsubscribe()
        this.subscriptions.aggregateBondedAdded = null
      }
      if (this.subscriptions.aggregateBondedRemoved) {
        this.subscriptions.aggregateBondedRemoved.unsubscribe()
        this.subscriptions.aggregateBondedRemoved = null
      }
      this.subscriptions.aggregateBondedAdded = this.listener.aggregateBondedAdded(this.address).subscribe((transaction) => {
        this.aggregateBondedAdded({ transaction })
      })
      this.subscriptions.aggregateBondedRemoved = this.listener.aggregateBondedRemoved(this.address).subscribe((transaction) => {
        this.aggregateBondedRemoved({ transaction })
      })
    },
    getConfirmedTransactions() {
      if (this.subscriptions.confirmed) {
        this.subscriptions.confirmed.unsubscribe()
        this.subscriptions.confirmed = null
      }
      this.subscriptions.confirmed = this.listener.confirmed(this.address).subscribe((transaction) => {
        this.confirmedAdded({ transaction })
      })
    }
  }
}
</script>
