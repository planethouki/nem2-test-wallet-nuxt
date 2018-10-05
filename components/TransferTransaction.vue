<template>
  <div>
    <span>Transfer Transaction: </span>
    <ul>
      <label>
        Recepient:
        <input v-model="t_recepient">
      </label>
      <label>
        Mosaic:
        <input v-model="t_mosaic">
      </label>
      <label>
        Message:
        <input v-model="t_message">
      </label>
      <input type="button" value="send" v-on:click="t_sendHandler">
      <ul>
        <li v-for="tx in t_sendHistory" v-bind:key="tx.hash">
          <a v-bind:href="tx.apiStatusUrl" target="_blank">{{ tx.hash }}</a>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
  const nem2Sdk = require("nem2-sdk");

  export default {
    name: "TransferTransaction",
    data() {
      return {
        t_recepient: "SCCVQQ-3N3AOW-DOL6FD-TLSQZY-UHL4SH-XKJEJX-2URE",
        t_mosaic: "nem:xem::1000000",
        t_message: "Hello Nem2!",
        t_sendHistory: [],
      }
    },
    computed: {
      wallet () { return this.$store.state.wallets.list[0] },
    },
    methods: {
      t_sendHandler: function(event) {
        let mosaics = this.t_mosaic.split(",").map((mosaicRawStr) => {
          let nameAndAmount = mosaicRawStr.split("::");
          return new nem2Sdk.Mosaic(
            new nem2Sdk.MosaicId(nameAndAmount[0]),
            nem2Sdk.UInt64.fromUint(nameAndAmount[1])
          );
        });
        let tx = nem2Sdk.TransferTransaction.create(
          nem2Sdk.Deadline.create(23),
          nem2Sdk.Address.createFromRawAddress(this.t_recepient),
          mosaics,
          nem2Sdk.PlainMessage.create(this.t_message),
          nem2Sdk.NetworkType.MIJIN_TEST
        );
        let account = this.wallet.open(new nem2Sdk.Password(this.walletPassword));
        let signedTx = account.sign(tx);
        let txHttp = new nem2Sdk.TransactionHttp(this.endpoint);
        txHttp.announce(signedTx).toPromise().then((resolve, reject) => {

        });
        let historyData = {
          hash: signedTx.hash,
          apiStatusUrl: `${this.endpoint}/transaction/${signedTx.hash}/status`
        };
        this.t_sendHistory.push(historyData);
      }
    }
  }
</script>

<style scoped>

</style>
