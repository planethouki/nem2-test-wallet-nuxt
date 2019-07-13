<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Escrow with Aggregate Bonded Transaction
      v-card-text
        v-flex
          v-card
            v-card-title
              div.subheading Payment
            v-card-text
              v-text-field(
                label="To Address"
                v-model="e_recipient1"
                required
                placeholder="ex). SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC or @alice")
              v-text-field(
                label="Mosaics"
                v-model="e_mosaics1"
                required
                :placeholder="`ex). ${mosaicPlaceholder.escrow1}`")
              v-text-field(
                label="Message"
                v-model="e_message1"
                :counter="1023"
                placeholder="ex). escrow payment")
        v-flex.pt-3
          v-card
            v-card-title
              div.subheading Invoice
            v-card-text
              v-text-field(
                label="Partner PublicKey"
                v-model="e_pubkey2"
                required
                :counter="64"
                placeholder="ex). CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993")
              v-text-field(
                label="Mosaics (hexMosaicId::absoluteAmount) (comma separated)"
                v-model="e_mosaics2"
                required
                :placeholder="`ex). ${mosaicPlaceholder.escrow2}`")
              v-text-field(
                label="Message"
                v-model="e_message2"
                :counter="1023"
                placeholder="ex). escrow invoice")
        v-flex.pt-3
          v-text-field(
            label="Max Fee"
            v-model="e_fee")
        v-flex.pt-3
          v-text-field(
            label="Lock Funds Mosaic"
            v-model="e_mosaic3"
            :placeholder="`ex). ${mosaicPlaceholder.currency10}`")
          v-text-field(
            label="Lock Funds Duration In Blocks"
            v-model="e_duration3"
            type="number"
            placeholder="ex). 480")
          v-text-field(
            label="Lock Funds Max Fee"
            v-model="e_fee3")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="e_announceHandler") announce
      v-card-text
        aggregatetx-history(v-bind:history="e_history")
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, PlainMessage, TransferTransaction,
  TransactionHttp, AggregateTransaction, PublicAccount, LockFundsTransaction, Listener
} from 'nem2-sdk'
import { filter, timeout } from 'rxjs/operators'
import AggregatetxHistory from '../history/AggregatetxHistory.vue'

export default {
  name: 'Escrow',
  components: {
    AggregatetxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'escrow'
      }
    }
  },
  data() {
    return {
      e_recipient1: 'SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC',
      e_mosaics1: '',
      e_message1: 'escrow payment',
      e_pubkey2: 'CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993',
      e_mosaics2: '',
      e_message2: 'escrow invoice',
      e_mosaic3: '',
      e_duration3: 480,
      e_history: [],
      e_fee: 0,
      e_fee3: 0
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('env', ['mosaicPlaceholder'])
  },
  mounted() {
    this.e_mosaics1 = this.mosaicPlaceholder.escrow1
    this.e_mosaics2 = this.mosaicPlaceholder.escrow2
    this.e_mosaic3 = this.mosaicPlaceholder.currency10
  },
  methods: {
    e_announceHandler: function (event) {
      const endpoint = this.$store.getters['wallet/endpoint']
      const wsEndpoint = endpoint.replace('http', 'ws')
      const listener = new Listener(wsEndpoint, WebSocket)
      const account = this.$store.getters['wallet/account']
      const network = account.address.networkType
      const paySender = account.publicAccount
      const invSender = PublicAccount.createFromPublicKey(this.e_pubkey2, network)
      const lockFundsMosaic = this.$parser.parseMosaic(this.e_mosaic3)
      const paymentTx = TransferTransaction.create(
        Deadline.create(),
        this.$parser.parseAddress(this.e_recipient1),
        this.$parser.parseMosaics(this.e_mosaics1),
        PlainMessage.create(this.e_message1),
        network
      )
      const invoiceTx = TransferTransaction.create(
        Deadline.create(),
        account.address,
        this.$parser.parseMosaics(this.e_mosaics2),
        PlainMessage.create(this.e_message2),
        network
      )
      const aggregateTx = AggregateTransaction.createBonded(
        Deadline.create(23),
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
        UInt64.fromUint(this.e_duration3),
        signedAggregateTx,
        network,
        UInt64.fromUint(this.e_fee3)
      )
      const signedLockFundsTx = account.sign(lockFundsTx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      listener.open().then(() => {
        return txHttp.announce(signedLockFundsTx).toPromise()
      }).then(() => {
        return new Promise((resolve, reject) => {
          listener.confirmed(account.address).pipe(
            timeout(90000),
            filter((transaction) => {
              return transaction.transactionInfo !== undefined &&
                  transaction.transactionInfo.hash === signedLockFundsTx.hash
            })
          ).subscribe(
            result => resolve(result),
            error => reject(error)
          )
        })
      }).then(() => {
        return txHttp.announceAggregateBonded(signedAggregateTx).toPromise()
      }).finally(() => {
        listener.close()
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
