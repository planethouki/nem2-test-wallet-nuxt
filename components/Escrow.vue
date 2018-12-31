<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Escrow with Aggregate Bonded Transaction
      v-card-text
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
              label="Mosaics (namespace:mosaic::absoluteAmount) (comma separated)"
              v-model="e_mosaics1"
              required
              placeholder="ex). nem:xem::1000000")
            v-text-field(
              label="Message"
              v-model="e_message1"
              :counter="1024"
              placeholder="ex). escrow payment")
      v-card-text
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
              label="Mosaics (namespace:mosaic::absoluteAmount) (comma separated)"
              v-model="e_mosaics2"
              required
              placeholder="ex). foo:bar::1")
            v-text-field(
              label="Message"
              v-model="e_message2"
              :counter="1024"
              placeholder="ex). escrow invoice")
      v-card-text
        v-text-field(
          label="Lock Funds Mosaic"
          v-model="e_mosaic3"
          placeholder="ex). nem:xem::10000000")
        v-text-field(
          label="Lock Funds Duration In Blocks"
          v-model="e_duration3"
          type="number"
          placeholder="ex). 480")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="e_announceHandler") announce
      v-card-text
        aggregatetx-history(v-bind:history="e_history")
</template>

<script>
  import AggregatetxHistory from './AggregatetxHistory.vue'
  import {
    Address, Deadline, UInt64, NetworkType, PlainMessage, TransferTransaction, Mosaic, MosaicId,
    Password, TransactionHttp, AggregateTransaction, PublicAccount, LockFundsTransaction, Listener
  } from 'nem2-sdk';
  import { filter, timeout } from 'rxjs/operators';

  export default {
    name: "Escrow",
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
        e_recipient1: "SAJC2D-OC76EA-TVJF65-KE6U2T-VGIN3F-NQZRJO-EWNZ",
        e_mosaics1: "nem:xem::10000000",
        e_message1: "escrow payment",
        e_pubkey2: "CC9E167E28CA4227F5C461BF40AEC60EFB98E200C998F86BEBCD68D4FC66D993",
        e_mosaics2: "foo:bar::1",
        e_message2: "escrow invoice",
        e_mosaic3: "nem:xem::10000000",
        e_duration3: 480,
        e_history: [],
      }
    },
    methods: {
      e_announceHandler: function(event) {
        const endpoint = this.endpoint;
        const wsEndpoint = endpoint.replace("http", "ws");
        const listener = new Listener(wsEndpoint, WebSocket);
        const account = this.wallet.open(this.walletPassword);
        const payRecipient = Address.createFromRawAddress(this.e_recipient1);
        const paySender = account.publicAccount;
        const payMessage = this.e_message1;
        const invRecipient = account.address;
        const invSender = PublicAccount.createFromPublicKey(this.e_pubkey2, NetworkType.MIJIN_TEST);
        const invMessage = this.e_message2;
        const lockFundsDuration = this.e_duration3;
        const payMosaics = this.e_mosaics1.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::");
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(Number(nameAndAmount[1]))
          )
        });
        const invMosaics = this.e_mosaics2.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::");
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(Number(nameAndAmount[1]))
          )
        });
        const lockFundsMosaic = (() => {
          let nameAndAmount = this.e_mosaic3.split("::");
          return new Mosaic(
            new MosaicId(nameAndAmount[0]),
            UInt64.fromUint(Number(nameAndAmount[1]))
          )
        })();
        let paymentTx = TransferTransaction.create(
          Deadline.create(23),
          payRecipient,
          payMosaics,
          PlainMessage.create(payMessage),
          NetworkType.MIJIN_TEST
        );
        let invoiceTx = TransferTransaction.create(
          Deadline.create(23),
          invRecipient,
          invMosaics,
          PlainMessage.create(invMessage),
          NetworkType.MIJIN_TEST
        );
        let aggregateTx = AggregateTransaction.createBonded(
          Deadline.create(23),
          [
            paymentTx.toAggregate(paySender),
            invoiceTx.toAggregate(invSender),
          ],
          NetworkType.MIJIN_TEST
        );
        let signedAggregateTx = account.sign(aggregateTx);
        let lockFundsTx = LockFundsTransaction.create(
          Deadline.create(23),
          lockFundsMosaic,
          UInt64.fromUint(lockFundsDuration),
          signedAggregateTx,
          NetworkType.MIJIN_TEST
        );
        let signedLockFundsTx = account.sign(lockFundsTx);
        let txHttp = new TransactionHttp(endpoint);
        listener.open().then(() => {
          return txHttp.announce(signedLockFundsTx).toPromise()
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
            )
          })
        }).then(() => {
          return txHttp.announceAggregateBonded(signedAggregateTx).toPromise()
        }).then((result) => {
          console.log(result)
        }).catch((error) => {
          console.error(error)
        }).finally(() => {
          listener.close()
        });
        let historyData = {
          agHash: signedAggregateTx.hash,
          agApiStatusUrl: `${endpoint}/transaction/${signedAggregateTx.hash}/status`,
          lfHash: signedLockFundsTx.hash,
          lfApiStatusUrl: `${endpoint}/transaction/${signedLockFundsTx.hash}/status`,
        };
        this.e_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
