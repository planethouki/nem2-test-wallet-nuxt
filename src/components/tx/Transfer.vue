<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Transfer Transaction
      v-card-text
        v-text-field(
          label="To Address"
          v-model="t_recipientAddress"
          required
          placeholder="ex). SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC or @alice")
        div.body-1 Mosaics
        .d-flex.align-baseline.mt-1(v-for="(t_mosaic, index) in t_mosaics" v-bind:key="index")
          v-text-field(
            label="Mosaic"
            v-model="t_mosaic.mosaicStr"
            required
            :placeholder="`ex). ${mosaicPlaceholder.transfer} or 4A1B0170C0E51B73::0`")
          v-btn(
            icon
            v-on:click="t_deleteMosaic(index)")
            v-icon delete_forever
        v-btn(
          @click="t_addMosaic"
          x-small) Add Mosaic
        v-radio-group(label="Message Type" v-model="t_messageType" row).mt-5
          v-radio(
            v-for="mt in t_messageTypes"
            :key="mt.type"
            :label="mt.label"
            :value="mt.type")
        v-text-field(
          label="Recipient Public Key"
          v-model="t_recipientPublicKey"
          v-if="t_messageType === 1"
          required
          placeholder="ex). 3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57")
        v-text-field(
          label="Message"
          v-model="t_message"
          :counter="t_messageType === 0 ? 1023 : 447"
          placeholder="ex) Thank you.")
        v-text-field(
          label="Max Fee"
          v-model="t_fee"
          min="0"
          type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="t_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="t_history")
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Deadline, UInt64, PlainMessage, TransferTransaction,
  TransactionHttp, EncryptedMessage, PublicAccount, MessageType,
  EmptyMessage
} from 'symbol-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'Transfer',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'transfer'
      }
    }
  },
  data () {
    return {
      t_recipientAddress: '',
      t_recipientPublicKey: '',
      t_mosaics: [],
      t_messageType: 0,
      t_messageTypes: [
        { type: MessageType.PlainMessage, label: MessageType[MessageType.PlainMessage] },
        { type: MessageType.EncryptedMessage, label: MessageType[MessageType.EncryptedMessage] }
      ],
      t_message: 'Hello Nem2!',
      t_fee: 0,
      t_history: []
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAccount',
      'endpoint'
    ]),
    ...mapGetters('chain', [
      'generationHash'
    ]),
    ...mapGetters('env', [
      'addressPlaceholder',
      'publicKeyPlaceholder',
      'mosaicPlaceholder',
      'feePlaceholder'
    ])
  },
  mounted () {
    this.t_mosaics = [{
      mosaicStr: this.mosaicPlaceholder.transfer
    }]
    this.t_fee = this.feePlaceholder.default
    this.t_recipientAddress = this.addressPlaceholder.alice
    this.t_recipientPublicKey = this.publicKeyPlaceholder.alice
  },
  methods: {
    t_deleteMosaic (index) {
      this.t_mosaics.splice(index, 1)
    },
    t_addMosaic (event) {
      this.t_mosaics.push({
        mosaicStr: this.mosaicPlaceholder.transferAdd
      })
    },
    t_announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const recipient = this.$parser.parseAddress(this.t_recipientAddress)
      const mosaics = this.t_mosaics
        .map(x => this.$parser.parseMosaic(x.mosaicStr))
        .sort((a, b) => {
          if (a.id.equals(b.id)) { return 0 }
          return a.id.toHex() > b.id.toHex() ? 1 : -1
        })
      const message = (() => {
        if (this.t_messageType === MessageType.PlainMessage) {
          return PlainMessage.create(this.t_message)
        } else if (this.t_messageType === MessageType.EncryptedMessage) {
          const recipientPublicAccount = PublicAccount.createFromPublicKey(
            this.t_recipientPublicKey,
            account.address.networkType)
          return EncryptedMessage.create(
            this.t_message,
            recipientPublicAccount,
            account.privateKey)
        } else {
          return EmptyMessage
        }
      })()
      const tx = TransferTransaction.create(
        Deadline.create(),
        recipient,
        mosaics,
        message,
        account.address.networkType,
        UInt64.fromUint(this.t_fee)
      )
      const signedTx = account.sign(tx, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx).toPromise().then(console.log)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transactionStatus/${signedTx.hash}`
      }
      this.t_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
