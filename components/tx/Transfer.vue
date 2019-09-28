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
        v-text-field(
          label="Mosaics"
          v-model="t_mosaics"
          required
          :placeholder="`ex). ${mosaicPlaceholder.transfer}`")
        v-radio-group(label="Message Type" v-model="t_messageType" row)
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
          v-model="t_fee")
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
  TransactionHttp, EncryptedMessage, PublicAccount
} from 'nem2-sdk'
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
      t_recipientAddress: 'SB2Y5N-D4FDLB-IO5KHX-TKRWOD-DG2QHI-N73DTY-T2PC',
      t_recipientPublicKey: '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57',
      t_mosaics: '',
      t_messageType: 0,
      t_messageTypes: [
        { type: 0, label: 'Plain' },
        { type: 1, label: 'Encrypted' }
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
      'mosaicPlaceholder'
    ])
  },
  mounted () {
    this.t_mosaics = this.mosaicPlaceholder.transfer
  },
  methods: {
    t_announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.endpoint
      const recipient = this.$parser.parseAddress(this.t_recipientAddress)
      const mosaics = this.$parser.parseMosaics(this.t_mosaics)
      const message = (() => {
        if (this.t_messageType === 0) {
          return PlainMessage.create(this.t_message)
        } else {
          const recipientPublicAccount = PublicAccount.createFromPublicKey(
            this.t_recipientPublicKey,
            account.address.networkType)
          return EncryptedMessage.create(this.t_message, recipientPublicAccount, account.privateKey)
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
      txHttp.announce(signedTx).toPromise().then((resolve, reject) => {
      })
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.t_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
