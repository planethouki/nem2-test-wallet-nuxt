<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Mosaic Alias
      v-card-text
        v-radio-group(label="Alias Action Type" v-model="actionType" row)
          v-radio(
            v-for="at in actionTypes"
            :key="at.type"
            :label="at.label"
            :value="at.type")
        v-text-field(
          label="Namespace Name"
          v-model="namespaceName"
          required
          placeholder="ex). foo")
        v-text-field(
          label="hexMosaicId"
          v-model="hexMosaicId"
          required)
        v-text-field(
          label="Max Fee"
          v-model="fee")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="announceHandler") announce
      v-card-text
        tx-history(v-bind:history="history")
</template>

<script>
import { mapGetters } from 'vuex'
import { Deadline, UInt64, NamespaceId, MosaicId, AliasAction, TransactionHttp, MosaicAliasTransaction } from 'nem2-sdk'
import TxHistory from '../history/TxHistory.vue'

export default {
  name: 'MosaicAlias',
  components: {
    TxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'mosaicAlias'
      }
    }
  },
  data () {
    return {
      actionType: AliasAction.Link,
      actionTypes: [
        { type: AliasAction.Link, label: 'Link' },
        { type: AliasAction.Unlink, label: 'Unlink' }
      ],
      namespaceName: 'foo',
      hexMosaicId: '79DC0ABC22594941',
      fee: 0,
      history: []
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount']),
    ...mapGetters('chain', ['generationHash'])
  },
  methods: {
    announceHandler (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const mosaicAliasTransaction = MosaicAliasTransaction.create(
        Deadline.create(),
        this.actionType,
        new NamespaceId(this.namespaceName),
        new MosaicId(this.hexMosaicId),
        account.address.networkType,
        UInt64.fromUint(this.fee)
      )
      const signedTx = account.sign(mosaicAliasTransaction, this.generationHash)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
