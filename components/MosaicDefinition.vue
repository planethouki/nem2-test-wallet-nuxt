<template lang="pug">
  v-flex(mb-5 v-if="wallet.address" v-bind:id="navTargetId")
    v-card
      v-card-title
        div.title Create Mosaic
      v-card-text
        v-text-field(
          label="Namespace"
          v-model="m_namespace"
          required
          placeholder="ex). foo")
        v-text-field(
          label="Mosaic Name"
          v-model="m_name"
          required
          placeholder="ex). bar")
        v-text-field(
          label="Supply Amount"
          v-model="m_delta"
          required
          type="number"
          placeholder="ex). 100")
        v-text-field(
          label="Divisibility"
          v-model="m_divisibility"
          required
          type="number"
          placeholder="ex). 0")
        v-text-field(
          label="Duration In Blocks"
          v-model="m_duration"
          required
          type="number"
          placeholder="ex). 10")
      v-card-actions
        v-btn(
          color="blue"
          class="white--text"
          @click="m_announceHandler") announce
      v-card-text
        tx-history(v-bind:history="m_history")
</template>

<script>
  import TxHistory from './TxHistory.vue'
  import {
    Deadline, UInt64, NetworkType, Password, TransactionHttp,
    MosaicDefinitionTransaction, MosaicSupplyChangeTransaction, MosaicProperties, MosaicSupplyType,
    AggregateTransaction} from 'nem2-sdk';

  export default {
    name: "",
    components: {
      TxHistory
    },
    props: [
      "endpoint",
      "wallet",
      "walletPassword",
      "navTargetId",
    ],
    data() {
      return {
        m_name: "bar",
        m_namespace: "foo",
        m_supplyMutable: true,
        m_transferable: true,
        m_levyMutable: false,
        m_divisibility: 0,
        m_duration: 10,
        m_delta: 100,
        m_history: [],
      }
    },
    methods: {
      m_announceHandler: function(event) {
        const namespace = this.m_namespace;
        const mosaic = this.m_name;
        const duration = this.m_duration;
        const divisibility = this.m_divisibility;
        const supplyMutable = this.m_supplyMutable;
        const transferable = this.m_transferable;
        const levyMutable = this.levyMutable;
        const delta = this.m_delta;
        const account = this.wallet.open(this.walletPassword);
        const endpoint = this.endpoint;
        let mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
          Deadline.create(),
          mosaic,
          namespace,
          MosaicProperties.create({
            supplyMutable: supplyMutable,
            transferable: transferable,
            levyMutable: levyMutable,
            divisibility: divisibility,
            duration: UInt64.fromUint(duration),
          }),
          NetworkType.MIJIN_TEST,
        );
        let mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
          Deadline.create(),
          mosaicDefinitionTransaction.mosaicId,
          MosaicSupplyType.Increase,
          UInt64.fromUint(delta),
          NetworkType.MIJIN_TEST,
        );
        let aggregateTransaction = AggregateTransaction.createComplete(
          Deadline.create(),
          [
            mosaicDefinitionTransaction.toAggregate(account.publicAccount),
            mosaicSupplyChangeTransaction.toAggregate(account.publicAccount),
          ],
          NetworkType.MIJIN_TEST,
          []
        );
        let signedTx = account.sign(aggregateTransaction);
        let txHttp = new TransactionHttp(endpoint);
        txHttp.announce(signedTx).subscribe(console.log, console.error);
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${endpoint}/transaction/${signedTx.hash}/status`
        };
        this.m_history.push(historyData);
      },
    }
  }
</script>

<style scoped>

</style>
