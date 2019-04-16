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
                placeholder="ex). SAJC2D-OC76EA-TVJF65-KE6U2T-VGIN3F-NQZRJO-EWNZ")
              v-text-field(
                label="Mosaics"
                v-model="e_mosaics1"
                required
                placeholder="ex). @cat.currency::0, 941299B2B7E1291C::0")
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
                placeholder="ex). 85BBEA6CC462B244::0, @cat.harvest::0")
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
            placeholder="ex). @cat.currency::10000000")
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
import {
  Address, Deadline, UInt64, PlainMessage, TransferTransaction, TransactionType,
  TransactionHttp, AggregateTransaction, PublicAccount, LockFundsTransaction, Listener,
  NamespaceHttp
} from 'nem2-sdk'
import { filter, timeout } from 'rxjs/operators'
import AggregatetxHistory from './AggregatetxHistory.vue'

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
      e_recipient1: 'SAJC2D-OC76EA-TVJF65-KE6U2T-VGIN3F-NQZRJO-EWNZ',
      e_mosaics1: '@cat.currency::0, 941299B2B7E1291C::0',
      e_message1: 'escrow payment',
      e_pubkey2: 'CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993',
      e_mosaics2: '85BBEA6CC462B244::0, @cat.harvest::0',
      e_message2: 'escrow invoice',
      e_mosaic3: '@cat.currency::10000000',
      e_duration3: 480,
      e_history: [],
      e_fee: 0,
      e_fee3: 0
    }
  },
  computed: {
    existsAccount() {
      return this.$store.getters['wallet/existsAccount']
    }
  },
  methods: {
    e_announceHandler: async function (event) {
      const endpoint = this.$store.getters['wallet/getEndpoint']
      const wsEndpoint = endpoint.replace('http', 'ws')
      const listener = new Listener(wsEndpoint, WebSocket)
      const account = this.$store.getters['wallet/getAccount']
      const network = account.address.networkType
      const paySender = account.publicAccount
      const invSender = PublicAccount.createFromPublicKey(this.e_pubkey2, network)
      let lockFundsMosaic = this.$parser.parseMosaic(this.e_mosaic3)
      const namespaceHttp = new NamespaceHttp(endpoint)
      lockFundsMosaic = await this.$parser.resolveIfNamespace(namespaceHttp, lockFundsMosaic)
      const paymentTx = TransferTransaction.create(
        Deadline.create(),
        Address.createFromRawAddress(this.e_recipient1),
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
      const aggregateTx = new AggregateTransaction(
        network,
        TransactionType.AGGREGATE_BONDED,
        this.$TransactionVersion.AGGREGATE_BONDED,
        Deadline.create(23),
        UInt64.fromUint(this.e_fee),
        [
          paymentTx.toAggregate(paySender),
          invoiceTx.toAggregate(invSender)
        ],
        []
      )
      const signedAggregateTx = account.sign(aggregateTx)
      const lockFundsTx = new LockFundsTransaction(
        network,
        this.$TransactionVersion.LOCK,
        Deadline.create(23),
        UInt64.fromUint(this.e_fee3),
        lockFundsMosaic,
        UInt64.fromUint(this.e_duration3),
        signedAggregateTx
      )
      const signedLockFundsTx = account.sign(lockFundsTx)
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
