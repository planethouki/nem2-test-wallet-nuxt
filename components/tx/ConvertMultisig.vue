<template lang="pug">
  v-flex(mb-5 v-if="existsAccount" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Convert to Multisig
      v-card-text
        v-text-field(
          label="Min Approval"
          v-model="u_minApprovalDelta"
          required
          type="number"
          placeholder="ex). 2")
        v-text-field(
          label="Min Removal"
          v-model="u_minRemovalDelta"
          required
          type="number"
          placeholder="ex). 2")
        v-flex.pt-5
          v-layout(v-for="(u_cosignatory, index) in u_cosignatories" v-bind:key="u_cosignatory" row wrap)
            v-flex
              v-layout(align-baseline)
                v-flex
                  v-text-field(
                    v-bind:label="'Cosignatory PublicKey: ' + (index + 1)"
                    v-bind:value="u_cosignatory"
                    required
                    :counter="64"
                    disabled)
                v-btn(
                  fab
                  small
                  flat
                  v-on:click="u_deleteCosignatory(index)")
                    v-icon delete_forever
        v-flex.pt-3
          v-layout(align-baseline)
            v-flex
              v-text-field(
                label="Add Cosignatory"
                v-model="u_addedCosignatory"
                :counter="64"
                placeholder="ex). C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0")
            v-btn(
              fab
              small
              flat
              v-on:click="u_addCosignatory")
                v-icon add_box
        v-text-field.pt-5(
          label="Max Fee"
          v-model="u_fee"
          required
          type="number")
        v-flex.pt-4
          v-text-field(
            label="Lock Funds Mosaic"
            placeholder="ex). @cat.currency::10000000"
            v-model="u_lockMosaic"
            required)
          v-text-field(
            label="Lock Funds Duration In Blocks"
            placeholder="ex). 480"
            v-model="u_lockDuration"
            required)
          v-text-field(
            label="Lock Funds Max Fee"
            v-model="u_lockFee"
            required
            type="number")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="u_announceHandler"
          :disabled="isMultisig || u_forbidMultisig") announce
        v-flex
          div(v-if="isMultisig || u_forbidMultisig") &nbsp; {{ u_announceDisabledMessage }}
      v-card-text
        aggregatetx-history(v-bind:history="u_history")
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Deadline, TransactionHttp, ModifyMultisigAccountTransaction, MultisigCosignatoryModification,
  MultisigCosignatoryModificationType, PublicAccount, UInt64, AggregateTransaction, Listener,
  LockFundsTransaction } from 'nem2-sdk'
import { filter, timeout } from 'rxjs/operators'
import AggregatetxHistory from '../history/AggregatetxHistory.vue'

export default {
  name: 'ConvertMultisig',
  components: {
    AggregatetxHistory
  },
  props: {
    navTargetId: {
      type: String,
      default() {
        return 'multisig'
      }
    }
  },
  data() {
    return {
      u_cosignatories: [
        '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C',
        '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57'
      ],
      u_addedCosignatory: 'C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0',
      u_minApprovalDelta: 2,
      u_minRemovalDelta: 2,
      u_history: [],
      u_fee: 0,
      u_lockFee: 0,
      u_lockMosaic: '@cat.currency::10000000',
      u_lockDuration: 480
    }
  },
  computed: {
    ...mapGetters('wallet', ['existsAccount', 'endpoint', 'address']),
    ...mapGetters('chain', ['generationHash']),
    ...mapGetters('multisigGraph', ['isMultisig']),
    u_forbidMultisig() {
      return this.address.plain() === 'SCA7ZS2B7DEEBGU3THSILYHCRUR32YYE55ZBLYA2'
    },
    u_announceDisabledMessage() {
      if (this.u_forbidMultisig) return 'Please try another account.'
      if (this.isMultisig) return 'Already converted'
      return ''
    }
  },
  watch: {},
  methods: {
    u_deleteCosignatory: function (index) {
      this.u_cosignatories.splice(index, 1)
    },
    u_addCosignatory: function (event) {
      this.u_cosignatories.push(this.u_addedCosignatory)
      this.u_addedCosignatory = ''
    },
    u_announceHandler: function (event) {
      const account = this.$store.getters['wallet/account']
      const endpoint = this.$store.getters['wallet/endpoint']
      const wsEndpoint = endpoint.replace('http', 'ws')
      const listener = new Listener(wsEndpoint, WebSocket)
      const networkType = account.address.networkType
      const minApprovalDelta = this.u_minApprovalDelta
      const minRemovalDelta = this.u_minRemovalDelta
      const cosignatories = this.u_cosignatories
      const tx = ModifyMultisigAccountTransaction.create(
        Deadline.create(),
        minApprovalDelta,
        minRemovalDelta,
        cosignatories.map((co) => {
          return new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            PublicAccount.createFromPublicKey(co, networkType)
          )
        }),
        networkType,
        UInt64.fromUint(this.u_fee)
      )
      const aggregateTx = AggregateTransaction.createBonded(
        Deadline.create(23),
        [
          tx.toAggregate(account.publicAccount)
        ],
        networkType,
        [],
        UInt64.fromUint(this.d_fee)
      )
      const signedAggregateTx = account.sign(aggregateTx, this.generationHash)
      const lockFundsTx = LockFundsTransaction.create(
        Deadline.create(),
        this.$parser.parseMosaic(this.u_lockMosaic),
        UInt64.fromUint(this.u_lockDuration),
        signedAggregateTx,
        networkType,
        UInt64.fromUint(this.u_lockFee)
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
      this.u_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
