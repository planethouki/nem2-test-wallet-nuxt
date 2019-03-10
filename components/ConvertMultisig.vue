<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
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
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="u_announceHandler"
          :disabled="u_isMultisig") announce
        v-flex
          div(v-if="u_isMultisig") &nbsp; {{ u_announceDisabledMessage }}
      v-card-text
        tx-history(v-bind:history="u_history")
</template>

<script>
import {
  Deadline, TransactionHttp, ModifyMultisigAccountTransaction, MultisigCosignatoryModification,
  MultisigCosignatoryModificationType, PublicAccount, AccountHttp, UInt64 } from 'nem2-sdk'
import TxHistory from './TxHistory.vue'

export default {
  name: 'ConvertMultisig',
  components: {
    TxHistory
  },
  props: [
    'endpoint',
    'wallet',
    'walletPassword',
    'navTargetId'
  ],
  data() {
    return {
      u_isMultisig: false,
      u_cosignatories: [
        '5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C',
        '3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57'
      ],
      u_addedCosignatory: 'C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0',
      u_minApprovalDelta: 2,
      u_minRemovalDelta: 2,
      u_history: [],
      u_announceDisabledMessage: '',
      u_fee: 0
    }
  },
  watch: {
    wallet: {
      handler: function (newVal, oldVal) {
        if (!this.wallet.address) {
          return
        }
        if (this.wallet.address.plain() === 'SCA7ZS2B7DEEBGU3THSILYHCRUR32YYE55ZBLYA2') {
          this.u_isMultisig = true
          this.u_announceDisabledMessage = 'Please try another account.'
          return
        }
        const accountHttp = new AccountHttp(this.endpoint)
        accountHttp.getMultisigAccountInfo(this.wallet.address).subscribe(
          (result) => {
            this.u_isMultisig = result.isMultisig()
            if (result.isMultisig()) {
              this.u_announceDisabledMessage = 'This account is already converted to multisig.'
            } else {
              this.u_announceDisabledMessage = ''
            }
          },
          () => {
            this.u_isMultisig = false
            this.u_announceDisabledMessage = ''
          }
        )
      }
    }
  },
  methods: {
    u_deleteCosignatory: function (index) {
      this.u_cosignatories.splice(index, 1)
    },
    u_addCosignatory: function (event) {
      this.u_cosignatories.push(this.u_addedCosignatory)
      this.u_addedCosignatory = ''
    },
    u_announceHandler: function (event) {
      const account = this.wallet.open(this.walletPassword)
      const endpoint = this.endpoint
      const networkType = this.wallet.network
      const minApprovalDelta = this.u_minApprovalDelta
      const minRemovalDelta = this.u_minRemovalDelta
      const cosignatories = this.u_cosignatories
      const tx = new ModifyMultisigAccountTransaction(
        networkType,
        this.$TransactionVersion.MODIFY_MULTISIG_ACCOUNT,
        Deadline.create(),
        UInt64.fromUint(this.u_fee),
        minApprovalDelta,
        minRemovalDelta,
        cosignatories.map((co) => {
          return new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            PublicAccount.createFromPublicKey(co, networkType)
          )
        })
      )
      const signedTx = account.sign(tx)
      const txHttp = new TransactionHttp(endpoint)
      txHttp.announce(signedTx)
      const historyData = {
        hash: signedTx.hash,
        apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
      }
      this.u_history.push(historyData)
    }
  }
}
</script>

<style scoped>

</style>
