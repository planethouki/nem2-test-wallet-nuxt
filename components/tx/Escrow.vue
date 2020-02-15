<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Escrow with Aggregate Bonded Transaction
      v-card-text
        v-flex
          v-card
            v-card-title
              .body-1 Payment
            v-card-text
              v-text-field(
                label="To Address"
                v-model="e_recipient1"
                required
                :placeholder="`ex). ${addressPlaceholder.alice} or @alice`")
              div.body-1 Mosaics
              .d-flex.align-baseline.mt-1(v-for="(e_mosaic1, index) in e_mosaics1" v-bind:key="index")
                v-text-field(
                  label="Mosaic"
                  v-model="e_mosaic1.mosaicStr"
                  required
                  :placeholder="`ex). ${mosaicPlaceholder.escrow1} or 4A1B0170C0E51B73::0`")
                v-btn(
                  icon
                  v-on:click="e_deleteMosaic1(index)")
                  v-icon delete_forever
              v-btn(
                @click="e_addMosaic1"
                x-small) Add Mosaic
              v-text-field(
                label="Message"
                v-model="e_message1"
                :counter="1023"
                placeholder="ex). escrow payment").mt-5
        v-flex.pt-3
          v-card
            v-card-title
              .body-1 Invoice
            v-card-text
              v-text-field(
                label="Partner PublicKey"
                v-model="e_publicKey2"
                required
                :counter="64"
                :placeholder="`ex). ${publicKeyPlaceholder.bob}`")
              div.body-1 Mosaics
              .d-flex.align-baseline.mt-1(v-for="(e_mosaic2, index) in e_mosaics2" v-bind:key="index")
                v-text-field(
                  label="Mosaic"
                  v-model="e_mosaic2.mosaicStr"
                  required
                  :placeholder="`ex). ${mosaicPlaceholder.escrow2} or 4A1B0170C0E51B73::0`")
                v-btn(
                  icon
                  v-on:click="e_deleteMosaic2(index)").mt-5
                  v-icon delete_forever
              v-btn(
                @click="e_addMosaic2"
                x-small) Add Mosaic
              v-text-field(
                label="Message"
                v-model="e_message2"
                :counter="1023"
                placeholder="ex). escrow invoice").mt-5
        v-flex.pt-3
          v-text-field(
            label="Max Fee"
            v-model="e_fee"
            min="0"
            type="number")
        v-flex.pt-3
          v-text-field(
            label="Lock Funds Mosaic"
            v-model="e_lockMosaic"
            :placeholder="`ex). ${mosaicPlaceholder.currency10}`")
          v-text-field(
            label="Lock Funds Duration In Blocks"
            v-model="e_lockDuration"
            type="number"
            min="0"
            placeholder="ex). 480")
          v-text-field(
            label="Lock Funds Max Fee"
            v-model="e_fee"
            min="0"
            type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="e_announceHandler") announce
      v-card-text
        aggregatetx-history(v-bind:history="e_history")
</template>

<script>
import AggregatetxHistory from '../history/AggregatetxHistory.vue'
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, PlainMessage, TransferTransaction,
  TransactionHttp, AggregateTransaction, PublicAccount, LockFundsTransaction
} from 'nem2-sdk'

export default {
  name: 'Escrow',
  components: {
    AggregatetxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'escrow'
      }
    }
  },
  data () {
    return {
      e_recipient1: '',
      e_mosaics1: [],
      e_message1: 'escrow payment',
      e_publicKey2: '',
      e_mosaics2: [],
      e_message2: 'escrow invoice',
      e_lockMosaic: '',
      e_lockDuration: 480,
      e_history: [],
      e_fee: 0,
      e_lockFee: 0
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', [
      'addressPlaceholder',
      'publicKeyPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.e_mosaics1 = [{ mosaicStr: this.mosaicPlaceholder.escrow1 }]
    this.e_mosaics2 = [{ mosaicStr: this.mosaicPlaceholder.escrow2 }]
    this.e_lockMosaic = this.mosaicPlaceholder.currency10
    this.e_fee = this.feePlaceholder.default
    this.e_lockFee = this.feePlaceholder.default
    this.e_recipient1 = this.addressPlaceholder.alice
    this.e_publicKey2 = this.publicKeyPlaceholder.bob
  },
  methods: {
    e_deleteMosaic1 (index) {
      this.e_mosaics1.splice(index, 1)
    },
    e_addMosaic1 (event) {
      this.e_mosaics1.push({
        mosaicStr: '4A1B0170C0E51B73::0'
      })
    },
    e_deleteMosaic2 (index) {
      this.e_mosaics2.splice(index, 1)
    },
    e_addMosaic2 (event) {
      this.e_mosaics2.push({
        mosaicStr: '4A1B0170C0E51B73::0'
      })
    },
    e_announceHandler (event) {
      const endpoint = this.$store.getters['wallet/endpoint']
      const account = this.$store.getters['wallet/account']
      const network = account.address.networkType
      const paySender = account.publicAccount
      const invSender = PublicAccount.createFromPublicKey(this.e_publicKey2, network)
      const lockFundsMosaic = this.$parser.parseMosaic(this.e_lockMosaic)
      const payMosaics = this.e_mosaics1
        .map(x => this.$parser.parseMosaic(x.mosaicStr))
        .sort((a, b) => {
          if (a.id.equals(b.id)) { return 0 }
          return a.id.toHex() > b.id.toHex() ? 1 : -1
        })
      const invMosaics = this.e_mosaics2
        .map(x => this.$parser.parseMosaic(x.mosaicStr))
        .sort((a, b) => {
          if (a.id.equals(b.id)) { return 0 }
          return a.id.toHex() > b.id.toHex() ? 1 : -1
        })
      const paymentTx = TransferTransaction.create(
        Deadline.create(),
        this.$parser.parseAddress(this.e_recipient1),
        payMosaics,
        PlainMessage.create(this.e_message1),
        network
      )
      const invoiceTx = TransferTransaction.create(
        Deadline.create(),
        account.address,
        invMosaics,
        PlainMessage.create(this.e_message2),
        network
      )
      const aggregateTx = AggregateTransaction.createBonded(
        Deadline.create(),
        [
          paymentTx.toAggregate(paySender),
          invoiceTx.toAggregate(invSender)
        ],
        network,
        [],
        UInt64.fromUint(this.e_fee)
      )
      const signedAggregateTx = account.sign(aggregateTx, this.generationHash)
      const lockFundsTx = LockFundsTransaction.create(
        Deadline.create(),
        lockFundsMosaic,
        UInt64.fromUint(this.e_lockDuration),
        signedAggregateTx,
        network,
        UInt64.fromUint(this.e_lockFee)
      )
      const signedLockFundsTx = account.sign(lockFundsTx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedLockFundsTx)
      const unsubscribe = this.$store.subscribeAction((action, state) => {
        if (action.type !== 'transactions/confirmedAdded') { return }
        if (action.payload.transaction.transactionInfo.hash !== signedLockFundsTx.hash) { return }
        txHttp.announceAggregateBonded(signedAggregateTx)
        unsubscribe()
      })
      const historyData = {
        agHash: signedAggregateTx.hash,
        agApiStatusUrl: `${endpoint}/transaction/${signedAggregateTx.hash}/status`,
        lfHash: signedLockFundsTx.hash,
        lfApiStatusUrl: `${endpoint}/transaction/${signedLockFundsTx.hash}/status`
      }
      this.e_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
