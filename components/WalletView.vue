<template>
  <div>
    <span>Wallet: </span>
    <ul>
      <li>name: {{ walletName }}</li>
      <li>
        <span>address: </span>
        <span ref="address">{{ walletAddress }}</span>
        <input type="button" value="copy" v-on:click="copyWalletAddressHandler">
      </li>
      <li>creation date: {{ walletCreationDate }}</li>
      <li>encrypted private key: </li>
      <ul>
        <li>data: {{ walletEncryptedPrivateKey }}</li>
        <li>initial vector: {{ walletEncryptedPrivateKeyIV }}</li>
      </ul>
    </ul>
    <div>
      <!--<span>Mosaics: </span>-->
      <!--<input type="button" value="reload" v-on:click="mosaicReloadHandler">-->
      <!--<ul>-->
        <!--<li v-for="mosaic in mosaics" v-bind:key="mosaic.id.toHex()">-->
          <!--{{ mosaic.id.toHex()}} {{mosaic.amount.compact()}}-->
        <!--</li>-->
      <!--</ul>-->
    </div>
  </div>
</template>

<script>
  const nem2Sdk = require("nem2-sdk");

  export default {
    name: "WalletView",
    data() {
      return {
      }
    },
    computed: {
      walletName() {
        if(this.$store.state.wallet)
          return this.$store.state.wallet.name
      },
      walletAddress() {
        if(this.$store.state.wallet)
          return this.$store.state.wallet.address.pretty()
      },
      walletCreationDate() {
        if(this.$store.state.wallet)
          return this.$store.state.wallet.creationDate
      },
      walletEncryptedPrivateKey() {
        if(this.$store.state.wallet)
          return this.$store.state.wallet.encryptedPrivateKey.encryptedKey;
      },
      walletEncryptedPrivateKeyIV() {
        if(this.$store.state.wallet)
          return this.$store.state.wallet.encryptedPrivateKey.iv;
      },
      // mosaics() {
      //   if(this.$store.state.wallet){
      //     let endpoint = this.$store.state.enpoint;
      //     let address = this.$store.state.wallet.adderss;
      //     let ac = new nem2Sdk.AccountHttp(endpoint, nem2Sdk.NetworkType.MIJIN_TEST);
      //     ac.getAccountInfo(address).toPromise().then((result) => {
      //       return result.mosaics;
      //     })
      //   }
      // }
    },
    methods: {
      mosaicReloadHandler: function(event) {
        let endpoint = this.$store.state.enpoint;
        let ac = new nem2Sdk.AccountHttp(endpoint, nem2Sdk.NetworkType.MIJIN_TEST);
        ac.getAccountInfo(this.recoveredWallet.address).toPromise().then((result) => {
          // this.importance = result.importance.compact();
          // this.publicKey = result.publicKey;
          this.mosaics = result.mosaics;
        }).catch((error) => {

        });
      },
      copyWalletAddressHandler: function(event) {
        let target = this.$refs.address;
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      },
    }
  }
</script>

<style scoped>

</style>
