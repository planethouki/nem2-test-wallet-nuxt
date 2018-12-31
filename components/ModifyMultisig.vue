<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Modify Multisig
      v-card-text
        v-text-field(
          label="Multisig Account PublicKey"
          v-model="d_multisigPublicKey"
          required
          :counter="64"
          placeholder="ex). AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26")
        v-text-field(
          label="Approval Change"
          v-model="d_minApprovalDelta"
          required
          type="number"
          placeholder="ex). 2")
        v-text-field(
          label="Removal Change"
          v-model="d_minRemovalDelta"
          required
          type="number"
          placeholder="ex). 2")
      v-card-text
        v-flex
          v-layout(v-for="(d_cosignatory, index) in d_cosignatories" v-bind:key="d_cosignatory.pubKey" row wrap)
            v-flex
              v-layout(align-baseline)
                span.grey--text.mr-1.pr-1 {{ d_cosignatory.isAdd ? 'Add' : 'Remove' }}
                v-flex
                  v-text-field(
                    v-bind:label="`${d_cosignatory.isAdd ? 'Add' : 'Remove'}` + ' Cosignatory PublicKey: ' + (index + 1)"
                    v-bind:value="d_cosignatory.pubKey"
                    required
                    :counter="64"
                    disabled)
                v-btn(
                  fab
                  small
                  flat
                  v-on:click="d_deleteModification(index)")
                    v-icon delete_forever
      v-card-title
        v-flex
          v-layout(align-baseline)
            div.mr-1.pr-1
              v-checkbox(
                v-bind:label="`${d_additionalModificationType ? 'Add' : 'Remove'}`"
                hide-details
                off-icon="remove_circle"
                on-icon="add_circle"
                v-model="d_additionalModificationType")
            v-flex
              v-text-field(
                v-bind:label="`Modification: ${d_additionalModificationType ? 'Add' : 'Remove'} Cosignatory PublicKey`"
                v-model="d_additionalModificationPubkey"
                :counter="64"
                placeholder="ex). C36F5BDDE8B2B586D17A4E6F4B999DD36EBD114023C1231E38ABCB1976B938C0")
            v-btn(
              fab
              small
              flat
              v-on:click="d_addModification")
                v-icon add_box
      v-card-text
        v-text-field(label="Lock Funds Mosaic" value="nem:xem::10000000"  disabled)
        v-text-field(label="Lock Funds Duration In Blocks" value="480" disabled)
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="d_announceHandler") announce
      v-card-text
        aggregatetx-history(v-bind:history="d_history")
</template>

<script>
  import AggregatetxHistory from './AggregatetxHistory.vue'
  import {
    Deadline, UInt64, NetworkType, Password, TransactionHttp, XEM, AggregateTransaction, ModifyMultisigAccountTransaction, MultisigCosignatoryModification,
    MultisigCosignatoryModificationType, PublicAccount, LockFundsTransaction, Listener
  } from 'nem2-sdk';
  import { filter, timeout } from 'rxjs/operators';

  export default {
    name: "ModifyMultisig",
    components: {
      AggregatetxHistory
    },
    props: [
      "endpoint",
      "wallet",
      "walletPassword",
      "navTargetId",
    ],
    data() {
      return {
        d_multisigPublicKey: "AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26",
        d_cosignatories: [
          {pubKey: "5D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C", isAdd: false},
        ],
        d_additionalModificationType: false,
        d_additionalModificationPubkey: "3390BF02D2BB59C8722297FF998CE89183D0906E469873284C091A5CDC22FD57",
        d_minApprovalDelta: -1,
        d_minRemovalDelta: -1,
        d_history: [],
      }
    },
    methods: {
      d_deleteModification: function(index) {
        this.d_cosignatories.splice(index, 1);
      },
      d_addModification: function(event) {
        this.d_cosignatories.push({
          pubKey: this.d_additionalModificationPubkey,
          isAdd: this.d_additionalModificationType
        });
        this.d_additionalModificationPubkey = "";
        this.d_additionalModificationType = false;
      },
      d_announceHandler: function (event) {
        const multisigPublicAccount = PublicAccount.createFromPublicKey(this.d_multisigPublicKey);
        const account = this.wallet.open(this.walletPassword);
        const endpoint = this.endpoint;
        const wsEndpoint = endpoint.replace("http", "ws");
        const listener = new Listener(wsEndpoint, WebSocket);
        const minApprovalDelta = this.d_minApprovalDelta;
        const minRemovalDelta = this.d_minRemovalDelta;
        const cosignatories = this.d_cosignatories;
        let modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
          Deadline.create(),
          minApprovalDelta,
          minRemovalDelta,
          cosignatories.map((co) => {
            return new MultisigCosignatoryModification(
              co.isAdd ? MultisigCosignatoryModificationType.Add : MultisigCosignatoryModificationType.Remove,
              PublicAccount.createFromPublicKey(co.pubKey, NetworkType.MIJIN_TEST)
            );
          }),
          NetworkType.MIJIN_TEST
        );
        let aggregateTx = AggregateTransaction.createBonded(
          Deadline.create(23),
          [
            modifyMultisigAccountTx.toAggregate(multisigPublicAccount),
          ],
          NetworkType.MIJIN_TEST
        );
        let signedAggregateTx = account.sign(aggregateTx);
        let lockFundsTx = LockFundsTransaction.create(
          Deadline.create(23),
          XEM.createRelative(10),
          UInt64.fromUint(480),
          signedAggregateTx,
          NetworkType.MIJIN_TEST
        );
        let signedLockFundsTx = account.sign(lockFundsTx);
        let txHttp = new TransactionHttp(endpoint);
        listener.open().then(() => {
          return txHttp.announce(signedLockFundsTx).toPromise();
        }).then(() => {
          return new Promise((resolve, reject) => {
            listener.confirmed(account.address).pipe(
              timeout(90000),
              filter((transaction) => {
                return transaction.transactionInfo !== undefined
                  && transaction.transactionInfo.hash === signedLockFundsTx.hash
              }),
            ).subscribe(
              result => resolve(result),
              error => reject(error)
            );
          });
        }).then(() => {
          return txHttp.announceAggregateBonded(signedAggregateTx).toPromise();
        }).then((result) => {
          console.log(result);
        }).catch((error) => {
          console.error(error);
        }).finally(() => {
          listener.close()
        });
        let historyData = {
          agHash: signedAggregateTx.hash,
          agApiStatusUrl: `${endpoint}/transaction/${signedAggregateTx.hash}/status`,
          lfHash: signedLockFundsTx.hash,
          lfApiStatusUrl: `${endpoint}/transaction/${signedLockFundsTx.hash}/status`,
        };
        this.d_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
